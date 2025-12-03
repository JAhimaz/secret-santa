"use client";
import { createClient } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import styles from "./LoginPage.module.css";
import Input from "@/components/common/Input/Input";
import Button from "@/components/common/Button/Button";
import Link from "next/link";
import Loader from "@/components/common/Loader/Loader";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [checkForOTP, setCheckForOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.push("/groups");
        setUser(session?.user || null);
        setCheckForOTP(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) { throw error; }

      setCheckForOTP(true);
    
    } catch (error: any) {
      setResponseMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <span className={styles.title}>SECRET SANTA</span>
        <div className={styles.loginContainer}>
        {!checkForOTP && !user && (
          <>
          <Input 
            type="email"
            placeholder="Enter your email"
            value={email}
            icon="email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button onClick={(e) => HandleSubmit(e)} disabled={loading || !email}>
            {loading ? <Loader size={16} /> : "Login"}
          </Button>
          {responseMessage && <span className={styles.errorMessage}>{responseMessage}</span>}
          </>
        )}

        {checkForOTP && !user && (
          <>
            <span className={styles.infoMessage}>Please check your email for the login link.</span>
            <span className={styles.returnMessage} onClick={() => {
              setCheckForOTP(false);
            }}>
              Wrong email? Return to login
            </span>
          </>
        )}
        </div>

      {user && (
        <div>
          Already logged in, redirecting...
        </div>
      )}
      <span className={styles.subfooter}>Created by <Link href="https://github.com/JAhimaz" referrerPolicy="no-referrer" target="_blank" className="link">Joshua Ahimaz</Link> - 2025</span>
    </div>
  );
}