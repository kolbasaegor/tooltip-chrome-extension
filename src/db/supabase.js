import "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../env.js";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
export const _supabase = supabase.createClient(supabaseUrl, supabaseKey);


