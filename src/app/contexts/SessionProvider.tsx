"use client";

import { createClient } from "@/src/app/library/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

interface SessionContextType {
  session: Session | null;
  setSession: (s: Session | null) => void;
  authEvent: string | null;
  setAuthEvent: (e: string | null) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  // authEvent is used here only for debugging purposes
  const [authEvent, setAuthEvent] = useState<string | null>(null);

  const supabase = createClient();

  // add auth.getSession() where ApiErrorCode session_not_found or session_expired is returned
  useEffect(() => {
    function getSessionOrLogin() {
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          if (session === null) {
            // console.log(
            //   "inside supabase.auth.getSession().then()\n session is null.\n signing in anonymously."
            // );
            return supabase.auth.signInAnonymously();
          } else {
            // console.log(
            //   `inside supabase.auth.getSession().then() session: ${
            //     session && JSON.stringify(session)
            //   }\n`
            // );
            setSession(session);
            return { data: { session: null } };
          }
        })
        .then(({ data: { session } }) => {
          if (session) {
            // console.log("Anonymous sign in was successful.");
            setSession(session);
          }
        })
        .catch((reason) => {
          console.log(
            `inside supabase.auth.getSession().then().catch() reason: ${reason}`
          );
        });
    }

    getSessionOrLogin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthEvent(event);
      console.log(
        `inside supabase.auth.onAuthStateChange -> event:${event}, session:${
          session ? JSON.stringify(session, null, 2) : null
        }`
      );
      setAuthEvent(event);
      if (event === "SIGNED_OUT") {
        // If the user signed out, we give them a new anonymous session
        getSessionOrLogin();
      } else if (session) {
        setSession(session);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, authEvent, setAuthEvent }}>
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
