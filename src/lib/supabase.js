import { createClient } from '@supabase/supabase-js';

// Remplacez ces deux valeurs par vos identifiants Supabase (disponibles dans Paramètres > API sur Supabase)
const supabaseUrl = 'https://VOTRE_PROJET_SUPABASE.supabase.co';
const supabaseAnonKey = 'VOTRE_CLE_ANON_SUPABASE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
