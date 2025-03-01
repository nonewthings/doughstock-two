
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://usrlbenuvsjogxfnabuh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzcmxiZW51dnNqb2d4Zm5hYnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDExNjIsImV4cCI6MjA1NjQxNzE2Mn0.5HDnLkQXW_suMkMPKE6bRoKADom9oW1COAh-8G-aZKE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
