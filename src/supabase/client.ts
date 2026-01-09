import { createClient } from '@supabase/supabase-js';

// Estes valores devem vir do teu ficheiro .env
// Se não tiveres .env configurado ainda, confirma se as variáveis estão a ser lidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltam as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey);