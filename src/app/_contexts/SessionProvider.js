"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/src/app/_library/supabase/client";
import { clientSignInAnonymously } from "../_library/clientActions";

const SessionContext = createContext(null);

function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  // authEvent is used here only for debugging purposes
  const [authEvent, setAuthEvent] = useState(null);

  const supabase = createClient();

  // add auth.getSession() where ApiErrorCode session_not_found or session_expired is returned
  useEffect(() => {
    function getSessionOrLogin() {
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          if (session === null) {
            console.log(
              "inside supabase.auth.getSession().then()\n session is null.\n signing in anonymously."
            );
            return supabase.auth.signInAnonymously();
          } else {
            console.log(
              `inside supabase.auth.getSession().then() session: ${
                session && JSON.stringify(session)
              }\n`
            );
            setSession(session);
            return { data: { session: null } };
          }
        })
        .then(({ data: { session } }) => {
          if (session) {
            console.log("Anonymous sign in was successful.");
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
          session ? JSON.stringify(session) : null
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

  // useEffect(() => {
  //   async function signInAnonymously() {
  //     const { data, error } = await clientSignInAnonymously();
  //     if (error) {
  //       console.error("Error signing in anonymously:", error);
  //     } else {
  //       console.log("Signed in anonymously:", data);
  //     }
  //   }

  //   if (!session) {
  //     signInAnonymously();
  //   }
  // }, [session]);

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
