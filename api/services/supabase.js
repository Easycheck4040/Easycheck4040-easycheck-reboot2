import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Isto ajuda a perceber se as variáveis estão a ser lidas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERRO: Chaves do Supabase não encontradas no .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);