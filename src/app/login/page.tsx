"use client";
import { createClient } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        // router.push("/groups");
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user || null);
        // router.push("/groups");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) { throw error; }
    
    } catch (error: any) {
      setResponseMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const HandleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      {!loading && !user && (
        <div style={{
          display: "flex",
          flexDirection: "column",
        }}>
          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{ marginBottom: "10px", padding: "8px", width: "300px" }}
          />
          <button onClick={HandleSubmit} disabled={loading} style={{ padding: "8px 16px" }}>
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
          {responseMessage && <p>{responseMessage}</p>}
        </div>
      )}

      {loading && <p>Loading...</p>}

      {!loading && user && (
        <div style={{
          display: "flex",
          flexDirection: "column",
        }}>
          <h2>Welcome, {user.email}</h2>
          <button style={{ padding: "8px 16px" }} onClick={HandleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}