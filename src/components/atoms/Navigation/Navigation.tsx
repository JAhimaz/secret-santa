"use client";

import { createClient } from "@/app/lib/supabase/client";
import styles from './Navigation.module.css';
import { useEffect, useState } from "react";

export default function Navigation() {

  const [user, setUser] = useState<{ email?: string } | null>(null);

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
  }

  return (
    <nav className={styles.navigation}>
      {/* {user ? (
        <div>
          <span>Welcome, {user.email}</span>
          <button onClick={HandleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      ) : (
        <span>Please log in</span>
      )} */}
    </nav>
  );
}