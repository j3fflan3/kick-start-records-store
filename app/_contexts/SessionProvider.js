"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../_library/supabase/client";
import { dbSignIn, dbSignOut } from "../_library/serverActions";

const SessionContext = createContext(null);

function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const supabase = createClient();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  async function signOut() {
    await dbSignOut();
  }

  async function signIn({ email, password }) {
    await dbSignIn({ email, password });
  }

  return (
    <SessionContext.Provider value={{ session, signOut, signIn }}>
      {children}
    </SessionContext.Provider>
  );
}

function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined)
    throw new Error("SessionContext used outside of provider");
  return context;
}

export { SessionProvider, useSession };
