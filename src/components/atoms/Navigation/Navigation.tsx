"use client";

import { createClient } from "@/app/lib/supabase/client";
import styles from './Navigation.module.css';
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { NAVITEMS } from "./NavItems";

export default function Navigation() {

  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [selected, setSelected] = useState<string>('groups');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user || null);
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  const HandleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <nav className={styles.navigation}>
      <div className={styles.leftItem}>hi</div>
      {NAVITEMS.map((item) => (
        <div key={item.id} className={`${styles.navItem} ${selected === item.id ? styles.active : ''}`} onClick={() => setSelected(item.id)}>{item.label}</div>
      ))}
      <div className={styles.rightItem}>hi</div>
    </nav>
  );
}