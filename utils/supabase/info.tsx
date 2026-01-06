const envUrl = (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : process.env?.VITE_SUPABASE_URL) || '';
const envAnonKey = (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : process.env?.VITE_SUPABASE_ANON_KEY) || '';

export const supabaseUrl = envUrl || '';
export const supabaseAnonKey = envAnonKey || '';