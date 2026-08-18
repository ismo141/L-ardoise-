import { createClient } from '@supabase/supabase-js';

// Remplacez ces deux valeurs par vos identifiants Supabase (disponibles dans Paramètres > API sur Supabase)
const supabaseUrl = 'https://dfrxijyjkdnhmsycauzs.supabase.co';
const supabaseAnonKey = 'sb_publishable_iBKDlJ05ASj5EB29d2rljg_h4bpTtke ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
