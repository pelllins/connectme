import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create Supabase client
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
