import Image from "next/image";
import styles from "./page.module.css";
import { createClient } from "./lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect("/groups");
  }

  redirect("/login");
}
