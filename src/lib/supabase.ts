import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente devem ser configuradas no arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ ATENÇÃO: Variáveis de ambiente do Supabase não encontradas. O painel admin não funcionará sem o arquivo .env configurado.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
