
import { createClient } from '@supabase/supabase-js';

/**
 * PROJECT ID: ihmnypmmxuzvsyxahqoi
 * SUCCESS: Anon key successfully integrated.
 */
const SUPABASE_URL = 'https://ihmnypmmxuzvsyxahqoi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobW55cG1teHV6dnN5eGFocW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNzQ2ODUsImV4cCI6MjA4Mzg1MDY4NX0.A5ZOksz_CzrO50dOKQwFN-sEp64RlUJKA8XPQfcNb_M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
