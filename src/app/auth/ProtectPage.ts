import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

export default async function AuthCheck() {
  // Check if user exists from Supabase Auth (server-side)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // If no user, redirect to login
    return redirect("/login");
  }
}