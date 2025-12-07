"use client";

import { createClient } from "@/app/lib/supabase/client";
import styles from "./Navigation.module.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NAVITEMS } from "./NavItems";
import Link from "next/link";
import Button from "@/components/common/Button/Button";
import { Icon } from "@/components/utils/Icons";
import { User } from "@supabase/supabase-js";

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [selected, setSelected] = useState<string>("groups");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") setUser(session?.user || null);
        if (event === "SIGNED_OUT") setUser(null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login"); // redirect() is server-only
  };

  useEffect(() => {
    if (!pathname) return;
    const path = pathname.split("/")[1]; // "groups" from "/groups"
    const currentItem = NAVITEMS.find((item) => item.href === `/${path}`);
    if (currentItem) {
      setSelected(currentItem.id);
    }
  }, [pathname]);

  if (!user) return null;

  return (
    <nav className={styles.navigation}>
      {NAVITEMS.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`${styles.navItem} ${
            selected === item.id ? styles.active : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
      <div className={styles.rightItems} >
        <div className={styles.userEmail}>
          {user.email}
        </div>
        <div className={styles.logout} onClick={handleLogout}>
          <Icon icon="logout" />
        </div>
      </div>
    </nav>
  );
}
