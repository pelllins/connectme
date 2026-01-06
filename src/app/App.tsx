import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationBar } from './components/NavigationBar';
import { HomePage } from './components/HomePage';
import { Bacheca } from './components/Bacheca';
import { Agenda } from './components/Agenda';
import { PostIt, UserProfile } from './types';
import { getAllPostIts, updatePostItPosition, savePostIt, updatePostItColor, batchSavePostIts } from './utils/api';

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    // Remember last opened section so refresh stays on the same page
    if (typeof window === 'undefined') return 'home';
    try {
      return localStorage.getItem('connectme_active_section') || 'home';
    } catch (error) {
      console.error('Failed to read active section from storage:', error);
      return 'home';
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  
  const sanitizePostIts = (items: any[]): PostIt[] => {
    return (items || [])
      .filter((p) => p && typeof p.id === 'string' && p.position && typeof p.position.x === 'number' && typeof p.position.y === 'number')
      .map((p) => ({
        participants: 0,
        ...p,
        position: {
          x: typeof p.position?.x === 'number' ? p.position.x : 0,
          y: typeof p.position?.y === 'number' ? p.position.y : 0,
        },
      }));
  };

  // Prevent default zoom behavior on mobile
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventZoom, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventZoom);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('connectme_active_section', activeSection);
    } catch (error) {
      console.error('Failed to persist active section:', error);
    }
  }, [activeSection]);
  
  // Mock user profile
  const userProfile: UserProfile = {
    name: 'Marco',
    surname: 'Rossi',
    matricola: '10123456',
    email: 'marco.rossi@mail.polimi.it',
    avatar: 'https://images.unsplash.com/photo-1729824186570-4d4aede00043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvZmlsZSUyMGF2YXRhcnxlbnwxfHx8fDE3NjU4ODkxNzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  // Mock post-its data
  const [postIts, setPostIts] = useState<PostIt[]>([]);

  const persistPostIts = (data: PostIt[]) => {
    setPostIts(data);
    try {
      localStorage.setItem('connectme_postits', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist post-its locally:', error);
    }
  };

  const persistJoined = (ids: string[]) => {
    setJoinedIds(ids);
    try {
      localStorage.setItem('connectme_joined', JSON.stringify(ids));
    } catch (error) {
      console.error('Failed to persist joined list:', error);
    }
  };

  // Load post-its from the database on mount
  useEffect(() => {
    // Restore joined list first
    try {
      const joinedRaw = localStorage.getItem('connectme_joined');
      if (joinedRaw) {
        setJoinedIds(JSON.parse(joinedRaw));
      }
    } catch (error) {
      console.error('Failed to load joined list:', error);
    }

    loadPostIts();
  }, []);

  const loadPostIts = async () => {
    console.log('📥 Loading post-its from database...');
    setIsLoading(true);
    try {
      const loadedPostIts = sanitizePostIts(await getAllPostIts());
      console.log(`📦 Loaded ${loadedPostIts.length} post-its from database`);
      
      // Seed only if the database is empty
      if (loadedPostIts.length === 0) {
        console.log('⚠️ Nessun post-it sul server, creo dataset iniziale...');
        const initialPostIts: PostIt[] = [
          {
            id: '1',
            title: 'Gruppo Studio Analisi',
            content: 'Cerco compagni per studiare Analisi 1 in preparazione dell\'esame di gennaio. Disponibile tutti i pomeriggi in biblioteca.',
            category: 'Studio',
            campus: 'Leonardo',
            date: '15 Dicembre, 14:30',
            participants: 4,
            position: { x: 50, y: 50 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 giorni fa
          },
          {
            id: '2',
            title: 'Aperitivo di Natale',
            content: 'Aperitivo pre-natalizio per tutti gli studenti! Ci vediamo al bar del campus per festeggiare insieme.',
            category: 'Social',
            campus: 'Leonardo',
            date: '18 Dicembre, 18:00',
            participants: 12,
            position: { x: 350, y: 80 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 giorni fa
          },
          {
            id: '3',
            title: 'Torneo Calcetto',
            content: 'Torneo di calcetto amichevole. Cerchiamo altre squadre interessate a partecipare!',
            category: 'Sport',
            campus: 'Bovisa',
            date: '20 Dicembre, 15:00',
            participants: 8,
            position: { x: 680, y: 120 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 giorni fa
          },
          {
            id: '4',
            title: 'Laboratorio Arduino',
            content: 'Workshop su Arduino e IoT. Portate il vostro laptop! Esperienza base richiesta.',
            category: 'Studio',
            campus: 'Bovisa',
            date: '17 Dicembre, 10:00',
            participants: 6,
            position: { x: 120, y: 380 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 giorni fa
          },
          {
            id: '5',
            title: 'Sessione Yoga',
            content: 'Yoga per studenti stressati! Sessione gratuita di rilassamento prima degli esami.',
            category: 'Sport',
            campus: 'Leonardo',
            date: '16 Dicembre, 17:30',
            participants: 10,
            position: { x: 450, y: 340 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 giorni fa
          },
          {
            id: '6',
            title: 'Scambio Appunti Fisica',
            content: 'Ho appunti completi di Fisica 2, cerco appunti di Elettronica per scambio.',
            category: 'Studio',
            campus: 'Leonardo',
            participants: 2,
            position: { x: 750, y: 400 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 giorno fa
          },
          {
            id: '7',
            title: 'Film Night',
            content: 'Serata cinema all\'aula magna. Votate il film che volete vedere!',
            category: 'Social',
            campus: 'Bovisa',
            date: '19 Dicembre, 20:00',
            participants: 15,
            position: { x: 200, y: 600 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 giorni fa
          },
          {
            id: '8',
            title: 'Corsa Mattutina',
            content: 'Gruppo di running mattutino. Partiamo dal campus alle 7:00, percorso 5km.',
            category: 'Sport',
            campus: 'Leonardo',
            participants: 5,
            position: { x: 520, y: 580 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 giorni fa (massimo invecchiamento)
          },
          {
            id: '9',
            title: 'Ripetizioni Matematica',
            content: 'Offro ripetizioni di matematica per studenti del primo anno. Esperienza pluriennale.',
            category: 'Studio',
            campus: 'Leonardo',
            participants: 3,
            position: { x: 900, y: 150 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 giorni fa
          },
          {
            id: '10',
            title: 'Festa di Laurea',
            content: 'Celebriamo la laurea di Maria! Tutti invitati al bar del campus giovedì sera!',
            category: 'Social',
            campus: 'Bovisa',
            date: '10 Novembre, 21:00',
            participants: 20,
            position: { x: 1100, y: 250 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 giorni fa
          },
          {
            id: '11',
            title: 'Partita Basket',
            content: 'Cerchiamo giocatori per completare la squadra di basket. Allenamento ogni martedì.',
            category: 'Sport',
            campus: 'Bovisa',
            participants: 7,
            position: { x: 320, y: 800 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(), // 27 giorni fa
          },
          {
            id: '12',
            title: 'Progetto Ingegneria',
            content: 'Cerco 2 persone per completare il team del progetto di Ingegneria del Software.',
            category: 'Studio',
            campus: 'Leonardo',
            date: '5 Novembre',
            participants: 3,
            position: { x: 580, y: 920 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), // 32 giorni fa
          },
          {
            id: '13',
            title: 'Karaoke Night',
            content: 'Serata karaoke per rilassarsi dopo gli esami! Portate i vostri amici!',
            category: 'Social',
            campus: 'Leonardo',
            participants: 18,
            position: { x: 1250, y: 450 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(), // 29 giorni fa
          },
          {
            id: '14',
            title: 'Trekking Gruppo',
            content: 'Escursione domenicale in montagna. Difficoltà media, esperienza consigliata.',
            category: 'Sport',
            campus: 'Leonardo',
            date: '8 Novembre',
            participants: 9,
            position: { x: 850, y: 650 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(), // 31 giorni fa
          },
          {
            id: '15',
            title: 'Preparazione TOEFL',
            content: 'Gruppo di studio per preparazione esame TOEFL. Cerchiamo altri interessati.',
            category: 'Studio',
            campus: 'Bovisa',
            participants: 4,
            position: { x: 1400, y: 120 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(), // 26 giorni fa
          },
          {
            id: '16',
            title: 'Aperitivo Erasmus',
            content: 'Aperitivo di benvenuto per gli studenti Erasmus appena arrivati!',
            category: 'Social',
            campus: 'Leonardo',
            participants: 25,
            position: { x: 650, y: 1150 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(), // 33 giorni fa
          },
          {
            id: '17',
            title: 'Torneo Tennis',
            content: 'Torneo di tennis inter-universitario. Iscrizioni aperte fino a venerdì!',
            category: 'Sport',
            campus: 'Bovisa',
            participants: 12,
            position: { x: 1550, y: 380 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(), // 34 giorni fa
          },
          {
            id: '18',
            title: 'Hackathon Weekend',
            content: 'Hackathon di 48 ore! Premi per i migliori progetti. Tutti i livelli benvenuti.',
            category: 'Studio',
            campus: 'Leonardo',
            date: '3 Novembre',
            participants: 30,
            position: { x: 280, y: 1350 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 giorni fa
          },
          {
            id: '19',
            title: 'Cena Multiculturale',
            content: 'Cena con piatti da tutto il mondo! Ognuno porta un piatto tipico del proprio paese.',
            category: 'Social',
            campus: 'Bovisa',
            participants: 22,
            position: { x: 1700, y: 650 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(), // 38 giorni fa
          },
          {
            id: '20',
            title: 'Palestra Gruppo',
            content: 'Gruppo palestra per principianti. Allenamento 3 volte a settimana con personal trainer.',
            category: 'Sport',
            campus: 'Leonardo',
            participants: 8,
            position: { x: 950, y: 1450 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString(), // 36 giorni fa
          },
          {
            id: '21',
            title: 'Gruppo Studio Fisica',
            content: 'Cerco compagni per studiare Fisica 2 in preparazione dell\'esame di febbraio. Disponibile tutti i pomeriggi in biblioteca.',
            category: 'Studio',
            campus: 'Leonardo',
            date: '15 Gennaio, 14:30',
            participants: 4,
            position: { x: 50, y: 50 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 giorni fa
          },
          {
            id: '22',
            title: 'Aperitivo di Capodanno',
            content: 'Aperitivo pre-capodanno per tutti gli studenti! Ci vediamo al bar del campus per festeggiare insieme.',
            category: 'Social',
            campus: 'Leonardo',
            date: '18 Gennaio, 18:00',
            participants: 12,
            position: { x: 350, y: 80 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 giorni fa
          },
          {
            id: '23',
            title: 'Torneo Pallavolo',
            content: 'Torneo di pallavolo amichevole. Cerchiamo altre squadre interessate a partecipare!',
            category: 'Sport',
            campus: 'Bovisa',
            date: '20 Gennaio, 15:00',
            participants: 8,
            position: { x: 680, y: 120 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 giorni fa
          },
          {
            id: '24',
            title: 'Laboratorio Raspberry Pi',
            content: 'Workshop su Raspberry Pi e IoT. Portate il vostro laptop! Esperienza base richiesta.',
            category: 'Studio',
            campus: 'Bovisa',
            date: '17 Gennaio, 10:00',
            participants: 6,
            position: { x: 120, y: 380 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 giorni fa
          },
          {
            id: '25',
            title: 'Sessione Pilates',
            content: 'Pilates per studenti stressati! Sessione gratuita di rilassamento prima degli esami.',
            category: 'Sport',
            campus: 'Leonardo',
            date: '16 Gennaio, 17:30',
            participants: 10,
            position: { x: 450, y: 340 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 giorni fa
          },
          {
            id: '26',
            title: 'Scambio Appunti Chimica',
            content: 'Ho appunti completi di Chimica 2, cerco appunti di Fisica per scambio.',
            category: 'Studio',
            campus: 'Leonardo',
            participants: 2,
            position: { x: 750, y: 400 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 giorno fa
          },
          {
            id: '27',
            title: 'Film Night',
            content: 'Serata cinema all\'aula magna. Votate il film che volete vedere!',
            category: 'Social',
            campus: 'Bovisa',
            date: '19 Gennaio, 20:00',
            participants: 15,
            position: { x: 200, y: 600 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 giorni fa
          },
          {
            id: '28',
            title: 'Corsa Mattutina',
            content: 'Gruppo di running mattutino. Partiamo dal campus alle 7:00, percorso 5km.',
            category: 'Sport',
            campus: 'Leonardo',
            participants: 5,
            position: { x: 520, y: 580 },
            color: '#FFB772',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 giorni fa (massimo invecchiamento)
          },
          {
            id: '29',
            title: 'Ripetizioni Matematica',
            content: 'Offro ripetizioni di matematica per studenti del primo anno. Esperienza pluriennale.',
            category: 'Studio',
            campus: 'Leonardo',
            participants: 3,
            position: { x: 900, y: 150 },
            color: '#5B92FF',
            createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 giorni fa
          },
          {
            id: '30',
            title: 'Festa di Laurea',
            content: 'Celebriamo la laurea di Maria! Tutti invitati al bar del campus giovedì sera!',
            category: 'Social',
            campus: 'Bovisa',
            date: '10 Novembre, 21:00',
            participants: 20,
            position: { x: 1100, y: 250 },
            color: '#FF704E',
            createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 giorni fa
          },
          // Nuove categorie: Passioni/Interessi
          {
            id: '36',
            title: 'Club Fotografia',
            content: 'Gruppo di appassionati di fotografia. Usciamo ogni weekend per esplorare Milano e scattare foto!',
            category: 'Passioni/Interessi',
            campus: 'Leonardo',
            date: '17 Dicembre, 10:00',
            participants: 8,
            position: { x: 1200, y: 900 },
            color: '#85DE91',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 giorni fa
          },
          {
            id: '37',
            title: 'Gaming Night',
            content: 'Serata gaming con console e PC. Giochi multiplayer e competizioni amichevoli!',
            category: 'Passioni/Interessi',
            campus: 'Bovisa',
            date: '19 Dicembre, 19:00',
            participants: 15,
            position: { x: 1500, y: 850 },
            color: '#85DE91',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 giorni fa
          },
          {
            id: '38',
            title: 'Book Club',
            content: 'Club di lettura mensile. Questo mese leggiamo "1984" di Orwell. Discussione aperta a tutti!',
            category: 'Passioni/Interessi',
            campus: 'Leonardo',
            participants: 6,
            position: { x: 1800, y: 1000 },
            color: '#85DE91',
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 giorni fa
          },
          {
            id: '39',
            title: 'Musica dal Vivo',
            content: 'Gruppo di musicisti si ritrova per jam session. Tutti gli strumenti benvenuti!',
            category: 'Passioni/Interessi',
            campus: 'Bovisa',
            date: '20 Dicembre, 18:00',
            participants: 10,
            position: { x: 2100, y: 780 },
            color: '#85DE91',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 giorni fa
          },
          {
            id: '40',
            title: 'Cineforum',
            content: 'Proiezione e discussione di film d\'autore. Questo mese: Fellini.',
            category: 'Passioni/Interessi',
            campus: 'Leonardo',
            participants: 12,
            position: { x: 2400, y: 950 },
            color: '#85DE91',
            createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 giorni fa
          },
          // Nuove categorie: Pausa Caffè
          {
            id: '41',
            title: 'Caffè alle 11',
            content: 'Pausa caffè mattutina! Ci vediamo al bar del campus per una chiacchierata rilassante.',
            category: 'Pausa Caffè',
            campus: 'Leonardo',
            date: '16 Dicembre, 11:00',
            participants: 5,
            position: { x: 300, y: 1500 },
            color: '#E895FF',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 giorno fa
          },
          {
            id: '42',
            title: 'Break Pomeridiano',
            content: 'Pausa caffè dopo le lezioni. Perfetto per rilassarsi e conoscere nuove persone!',
            category: 'Pausa Caffè',
            campus: 'Bovisa',
            date: '17 Dicembre, 15:30',
            participants: 7,
            position: { x: 600, y: 1600 },
            color: '#E895FF',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 giorni fa
          },
          {
            id: '43',
            title: 'Caffè e Dolce',
            content: 'Pausa caffè con dolcetti fatti in casa! Ognuno porta qualcosa da condividere.',
            category: 'Pausa Caffè',
            campus: 'Leonardo',
            participants: 9,
            position: { x: 900, y: 1700 },
            color: '#E895FF',
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 giorni fa
          },
          {
            id: '44',
            title: 'Caffè Mattutino',
            content: 'Sveglia con un buon caffè prima delle lezioni delle 8:30!',
            category: 'Pausa Caffè',
            campus: 'Bovisa',
            date: '18 Dicembre, 08:00',
            participants: 4,
            position: { x: 1200, y: 1550 },
            color: '#E895FF',
            createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 giorni fa
          },
          {
            id: '45',
            title: 'Break Esami',
            content: 'Pausa caffè durante la sessione esami. Ci sosteniamo a vicenda!',
            category: 'Pausa Caffè',
            campus: 'Leonardo',
            participants: 8,
            position: { x: 1500, y: 1650 },
            color: '#E895FF',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 giorni fa
          },
          // Nuove categorie: Pranzo
          {
            id: '46',
            title: 'Pranzo in Mensa',
            content: 'Pranzo di gruppo in mensa! Così non mangiamo da soli e facciamo nuove conoscenze.',
            category: 'Pranzo',
            campus: 'Leonardo',
            date: '16 Dicembre, 12:30',
            participants: 6,
            position: { x: 2000, y: 1400 },
            color: '#FB2E74',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 giorni fa
          },
          {
            id: '47',
            title: 'Pranzo al Sacco',
            content: 'Pranzo al parco con panini e cibo da casa. Bello con il bel tempo!',
            category: 'Pranzo',
            campus: 'Bovisa',
            date: '17 Dicembre, 13:00',
            participants: 8,
            position: { x: 2300, y: 1500 },
            color: '#FB2E74',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 giorni fa
          },
          {
            id: '48',
            title: 'Pizza tutti insieme',
            content: 'Andiamo in pizzeria! Dividiamo il conto e mangiamo una buona pizza napoletana.',
            category: 'Pranzo',
            campus: 'Leonardo',
            participants: 10,
            position: { x: 2600, y: 1350 },
            color: '#FB2E74',
            createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 giorni fa
          },
          {
            id: '49',
            title: 'Poke Bowl',
            content: 'Pranzo healthy con poke bowl! Chi viene?',
            category: 'Pranzo',
            campus: 'Bovisa',
            date: '19 Dicembre, 12:00',
            participants: 5,
            position: { x: 2900, y: 1450 },
            color: '#FB2E74',
            createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), // 16 giorni fa
          },
          {
            id: '50',
            title: 'Pranzo Internazionale',
            content: 'Pranzo al ristorante etnico. Ogni settimana una cucina diversa!',
            category: 'Pranzo',
            campus: 'Leonardo',
            participants: 12,
            position: { x: 3200, y: 1550 },
            color: '#FB2E74',
            createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 giorni fa
          },
        ];
        
        // Show data immediately and keep it locally even if the server is offline
        persistPostIts(initialPostIts);

        // Save initial data to DB (best effort)
        try {
          await batchSavePostIts(initialPostIts);
        } catch (error) {
          console.error('Initial seed save failed (offline mode):', error);
          setIsBackendOnline(false);
        }
      } else {
        console.log(`✅ Loaded ${loadedPostIts.length} post-its from database`);
        console.log('📍 First 3 post-it positions:', loadedPostIts.slice(0, 3).map(p => ({ id: p.id, title: p.title, position: p.position })));
        persistPostIts(loadedPostIts);
        // Migrazione automatica dei colori in base alla categoria
        const categoryColors: Record<string, string> = {
          'Studio': '#5B92FF',
          'Social': '#FF704E',
          'Sport': '#FFB772',
        };
        
        // Controlla se ci sono post-it con colori vecchi e aggiornali
        const needsUpdate = loadedPostIts.filter(post => {
          const expectedColor = categoryColors[post.category];
          return expectedColor && post.color !== expectedColor;
        });
        
        if (needsUpdate.length > 0) {
          console.log(`Migrazione colori: aggiornamento di ${needsUpdate.length} post-it...`);
          
          for (const postIt of needsUpdate) {
            const newColor = categoryColors[postIt.category];
            try {
              await updatePostItColor(postIt.id, newColor);
              // Aggiorna anche localmente
              postIt.color = newColor;
            } catch (error) {
              console.error(`Errore durante l'aggiornamento del colore per post-it ${postIt.id}:`, error);
            }
          }
          
          // Ricarica i post-it aggiornati
          const updatedPostIts = sanitizePostIts(await getAllPostIts());
          persistPostIts(updatedPostIts);
        }
      }
    } catch (error) {
      console.error('Error loading post-its:', error);
      setIsBackendOnline(false);
      try {
        const cached = localStorage.getItem('connectme_postits');
        if (cached) {
          const parsed = sanitizePostIts(JSON.parse(cached));
          console.log('📦 Loaded post-its from localStorage fallback');
          persistPostIts(parsed);
        }
      } catch (storageError) {
        console.error('Failed to load post-its from localStorage:', storageError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePostIt = async (newPostItData: Omit<PostIt, 'id' | 'position' | 'participants'>) => {
    const newPostIt: PostIt = {
      ...newPostItData,
      id: Date.now().toString(),
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
      participants: 1,
      createdAt: new Date().toISOString(), // Add timestamp for aging effect
    };

    const updatedList = [...postIts, newPostIt];
    persistPostIts(updatedList);

    try {
      await savePostIt(newPostIt);
    } catch (error) {
      console.error('Failed to save new post-it to database (kept locally):', error);
      setIsBackendOnline(false);
    }
  };

  const handleUpdatePostItPosition = async (id: string, x: number, y: number) => {
    console.log(`🔄 Updating position for post-it ${id} to (${x}, ${y})`);
    
    // Update UI immediately
    const updatedPostIts = postIts.map((post) =>
      post.id === id ? { ...post, position: { x, y } } : post
    );
    persistPostIts(updatedPostIts);
    
    // Try to save to database
    try {
      console.log(`💾 Saving post-it ${id} with new position via upsert`);
      const updated = updatedPostIts.find(p => p.id === id);
      if (updated) {
        await savePostIt(updated);
        console.log(`✅ Position saved successfully for post-it ${id}`);
        setIsBackendOnline(true);
      }
    } catch (error) {
      console.error('❌ Failed to update position in database (will use localStorage):', error);
      setIsBackendOnline(false);
    }
  };

  const handleParticipate = async (id: string) => {
    const current = postIts.find(p => p.id === id);
    if (!current) return;

    const isJoined = joinedIds.includes(id);
    const previousPostIts = postIts;
    const previousJoined = joinedIds;
    const delta = isJoined ? -1 : 1;

    const updatedPost: PostIt = {
      ...current,
      participants: Math.max(0, (current.participants || 0) + delta),
    };

    const nextList = postIts.map(p => p.id === id ? updatedPost : p);
    const nextJoined = isJoined ? joinedIds.filter(j => j !== id) : [...joinedIds, id];

    persistPostIts(nextList);
    persistJoined(nextJoined);

    try {
      await savePostIt(updatedPost);
      setIsBackendOnline(true);
    } catch (error) {
      console.error('❌ Failed to save participation change (reverting locally):', error);
      setIsBackendOnline(false);
      persistPostIts(previousPostIts);
      persistJoined(previousJoined);
    }
  };

  const handleViewAllPosts = () => {
    setActiveSection('bacheca');
  };

  // Get 3 most recent posts for homepage preview
  const recentPostIts = postIts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        showMenu={activeSection === 'bacheca'} 
        onMenuClick={() => {}} 
        title={activeSection === 'bacheca' ? 'Connect-me' : 'Io e il Polimi'}
        showLogo={activeSection === 'bacheca'}
      />
      
      {activeSection === 'home' && (
        <HomePage 
          userProfile={userProfile} 
          recentPostIts={recentPostIts}
          onViewAllPosts={handleViewAllPosts}
        />
      )}
      
      {activeSection === 'bacheca' && (
        <Bacheca 
          postIts={postIts}
          onUpdatePostItPosition={handleUpdatePostItPosition}
          onCreatePostIt={handleCreatePostIt}
          joinedIds={joinedIds}
          onParticipate={handleParticipate}
        />
      )}

      {activeSection === 'agenda' && (
        <Agenda />
      )}

      {activeSection === 'polimi' && (
        <HomePage 
          userProfile={userProfile} 
          recentPostIts={recentPostIts}
          onViewAllPosts={handleViewAllPosts}
        />
      )}

      {activeSection === 'campus' && (
        <div className="max-w-7xl mx-auto px-6 py-8 pb-24 bg-gray-50 min-h-screen">
          <h2 className="text-gray-900 mb-4">Campus</h2>
          <p className="text-gray-600">Sezione in arrivo...</p>
        </div>
      )}

      <NavigationBar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
    </div>
  );
}

export default App;