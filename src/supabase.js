import { createClient } from '@supabase/supabase-js'

// Reemplaza estas variables con las tuyas de tu proyecto de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://husuzrescciumddexxsg.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_C2CNf9yBuZYmOJmUvSLIFA_xSQBMpIc'

export const supabase = createClient(supabaseUrl, supabaseKey)
