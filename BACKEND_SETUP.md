# 🔧 SETUP BACKEND SUPABASE PER PARTECIPAZIONI SINCRONIZZATE

## � Struttura Tabella postits

La tabella `postits` contiene già i campi per le partecipazioni:

```sql
CREATE TABLE postits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  campus TEXT NOT NULL,
  date TEXT,
  
  -- 👇 CAMPI PER PARTECIPAZIONE (usati direttamente)
  participants INTEGER DEFAULT 0,          -- Contatore: quante persone partecipano
  participantIds TEXT[] DEFAULT '{}',      -- Array: ID di chi partecipa
  
  position JSONB NOT NULL,
  color TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita Realtime per sincronizzazione live
ALTER PUBLICATION supabase_realtime ADD TABLE postits;

-- Indici per performance
CREATE INDEX idx_postits_category ON postits(category);
CREATE INDEX idx_postits_campus ON postits(campus);
CREATE INDEX idx_postits_created ON postits(createdAt DESC);
```

**Esempio di un post-it con partecipazioni:**
```json
{
  "id": "1",
  "title": "Gruppo Studio Analisi",
  "content": "Cerco compagni per studiare...",
  "category": "Studio",
  "campus": "Leonardo",
  "participants": 3,
  "participantIds": ["10123456", "10234567", "10345678"],
  "position": {"x": 50, "y": 50},
  "color": "#5B92FF",
  "createdAt": "2026-01-07T10:00:00Z"
}
```

## 📋 Passo 1: Verifica/Crea la Tabella nel Database

Accedi a [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor → Esegui questo script:

```sql
-- Verifica se la tabella esiste, altrimenti crea
CREATE TABLE IF NOT EXISTS postits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  campus TEXT NOT NULL,
  date TEXT,
  participants INTEGER DEFAULT 0,
  participantIds TEXT[] DEFAULT '{}',
  position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}',
  color TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE postits;
```

## 🔐 Passo 2: Configura Row Level Security (RLS)

```sql
-- Abilita RLS
ALTER TABLE postits ENABLE ROW LEVEL SECURITY;

-- Policy: Chiunque può leggere
CREATE POLICY "Allow public read" ON postits
  FOR SELECT USING (true);

-- Policy: Chiunque può inserire
CREATE POLICY "Allow public insert" ON postits
  FOR INSERT WITH CHECK (true);

-- Policy: Chiunque può aggiornare
CREATE POLICY "Allow public update" ON postits
  FOR UPDATE USING (true) WITH CHECK (true);

-- Policy: Chiunque può cancellare
CREATE POLICY "Allow public delete" ON postits
  FOR DELETE USING (true);
```

## 🌐 Passo 3: Deploy Edge Function

1. Copia il codice da sotto
2. Nel file `supabase/functions/make-server-3ea9e007/index.tsx`, sostituisci il contenuto
3. Esegui il deploy:

```bash
cd /Users/niccolopellino/Desktop/Connect-me\ App\ Design\ \(Copy\)
supabase functions deploy make-server-3ea9e007
```

### Codice Edge Function completo:

```typescript
// supabase/functions/make-server-3ea9e007/index.tsx
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_ANON_KEY') || ''
);

Deno.serve(async (req) => {
  const { pathname } = new URL(req.url);

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // GET /postits - Ottieni tutti i post-it
    if (pathname === '/make-server-3ea9e007/postits' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('postits')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return new Response(
        JSON.stringify({ postIts: data || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /postits - Crea nuovo post-it
    if (pathname === '/make-server-3ea9e007/postits' && req.method === 'POST') {
      const postIt = await req.json();
      const { data, error } = await supabase
        .from('postits')
        .insert([postIt])
        .select()
        .single();

      if (error) throw error;
      return new Response(
        JSON.stringify({ postIt: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /postits/batch - Salva batch
    if (pathname === '/make-server-3ea9e007/postits/batch' && req.method === 'POST') {
      const postIts = await req.json();
      const { data, error } = await supabase
        .from('postits')
        .upsert(postIts)
        .select();

      if (error) throw error;
      return new Response(
        JSON.stringify({ postIts: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PUT /postits/:id/position - Aggiorna posizione
    if (pathname.match(/^\/make-server-3ea9e007\/postits\/.*\/position$/)) {
      const id = pathname.split('/')[3];
      const { x, y } = await req.json();

      const { data, error } = await supabase
        .from('postits')
        .update({ position: { x, y }, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return new Response(
        JSON.stringify({ postIt: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /postits/:id/participate - Aggiungi partecipante
    if (pathname.match(/^\/make-server-3ea9e007\/postits\/.*\/participate$/) && req.method === 'POST') {
      const id = pathname.split('/')[3];
      const { userId } = await req.json();

      // Leggi post-it
      const { data: postIt, error: readError } = await supabase
        .from('postits')
        .select('*')
        .eq('id', id)
        .single();

      if (readError) throw readError;

      // Controlla se già partecipa
      const participantIds = postIt.participantIds || [];
      if (participantIds.includes(userId)) {
        return new Response(
          JSON.stringify({ postIt }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Aggiungi partecipante
      const newParticipantIds = [...participantIds, userId];
      const { data: updated, error: updateError } = await supabase
        .from('postits')
        .update({
          participants: (postIt.participants || 0) + 1,
          participantIds: newParticipantIds,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return new Response(
        JSON.stringify({ postIt: updated }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE /postits/:id/participate - Rimuovi partecipante
    if (pathname.match(/^\/make-server-3ea9e007\/postits\/.*\/participate$/) && req.method === 'DELETE') {
      const id = pathname.split('/')[3];
      const { userId } = await req.json();

      // Leggi post-it
      const { data: postIt, error: readError } = await supabase
        .from('postits')
        .select('*')
        .eq('id', id)
        .single();

      if (readError) throw readError;

      // Rimuovi partecipante
      const participantIds = (postIt.participantIds || []).filter((uid: string) => uid !== userId);
      const { data: updated, error: updateError } = await supabase
        .from('postits')
        .update({
          participants: Math.max(0, (postIt.participants || 1) - 1),
          participantIds,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return new Response(
        JSON.stringify({ postIt: updated }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## 🚀 Comandi Deployment

```bash
# 1. Login a Supabase CLI (una volta sola)
supabase login

# 2. Link il progetto
supabase link --project-ref <tuo-project-id>

# 3. Deploy Edge Function
supabase functions deploy make-server-3ea9e007

# 4. Verifica che sia online
curl https://<project-id>.supabase.co/functions/v1/make-server-3ea9e007/postits \
  -H "Authorization: Bearer <anon-key>"
```

## ✅ Verifica che tutto funzioni

1. Testa l'API:
```bash
curl -X GET \
  https://<project-id>.supabase.co/functions/v1/make-server-3ea9e007/postits \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json"
```

2. Testa partecipazione:
```bash
curl -X POST \
  https://<project-id>.supabase.co/functions/v1/make-server-3ea9e007/postits/1/participate \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "marco@example.com"}'
```

## 🐛 Troubleshooting

**Errore: "Function not found"**
- Controlla che il nome della function sia corretto: `make-server-3ea9e007`
- Verifica che sia deployata: `supabase functions list`

**Errore: "RLS policy denied"**
- Assicurati di aver eseguito i comandi RLS sopra
- Verifica che le policy consentano SELECT/INSERT/UPDATE/DELETE

**Partecipazioni non sincronizzate tra dispositivi**
- Apri DevTools (F12) → Console
- Controlla che Realtime sia sottoscritto: cerca "🔌 Setting up Realtime"
- Verifica che non ci siano errori nell'API

