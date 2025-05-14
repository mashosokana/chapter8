import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function assertAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer', '') ?? '';
  const supabase = supabaseServer(token) as SupabaseClient;

  const  {data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('UNAUTHORIZED');
  }
}