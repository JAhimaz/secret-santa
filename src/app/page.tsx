import AuthCheck from "@/app/auth/ProtectPage";
import { createClient } from "./lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  await AuthCheck();
  redirect("/groups")
}
