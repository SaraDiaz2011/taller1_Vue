import { createClient } from '@supabase/supabase-js' //se instala la dependencia

// Reemplaza estas variables con las tuyas de tu proyecto de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://husuzrescciumddexxsg.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c3V6cmVzY2NpdW1kZGV4eHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTMzODQsImV4cCI6MjA4ODIyOTM4NH0.Oi0nHhwemWhrjt4pY_qQVFHVS5CwIU25-dGIr7g4-Js'

export const supabase = createClient(supabaseUrl, supabaseKey)
