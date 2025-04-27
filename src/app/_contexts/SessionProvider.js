"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/src/app/_library/supabase/client";

const SessionContext = createContext(null);

function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  // authEvent is used here only for debugging purposes
  const [authEvent, setAuthEvent] = useState(null);
  const supabase = createClient();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthEvent(event);
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        console.log(`calling setSession()`);
        setSession(session);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <SessionContext.Provider value={{ session, setSession, authEvent }}>
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
