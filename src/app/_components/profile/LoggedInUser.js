"use client";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const profileSession = {
  access_token:
    "eyJhbGciOiJIUzI1NiIsImtpZCI6IjBxaUhSam05d0VHaUJta2wiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Zuc2hhbmZ0eXB6dmFqcGJid3hyLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmYmJkNWVkZi0xYmI5LTRlZTQtOGQyMy1jMjY1N2FlNzYxNmIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ1MTAzNjUwLCJpYXQiOjE3NDUxMDAwNTAsImVtYWlsIjoicmlja3lAaGVhcnRvZmN5Z251cy5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoicmlja3lAaGVhcnRvZmN5Z251cy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyc3ROYW1lIjoiUmlja3kiLCJsYXN0TmFtZSI6IkxhbmUiLCJtYWlsaW5nTGlzdCI6dHJ1ZSwibm90aWZ5TGlzdCI6ZmFsc2UsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiZmJiZDVlZGYtMWJiOS00ZWU0LThkMjMtYzI2NTdhZTc2MTZiIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDUxMDAwNTB9XSwic2Vzc2lvbl9pZCI6IjVhY2QyNDc4LWVjMTYtNDFkZi1iYTg0LWQ3ODliM2RhY2I1MSIsImlzX2Fub255bW91cyI6ZmFsc2V9.MzumQ8Wc_NAxqVx3chgYeVjdp7fn34FMRUQehn6Uefg",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 1745103650,
  refresh_token: "7ILWJ-6qZyixpxRmqGlDVw",
  user: {
    id: "fbbd5edf-1bb9-4ee4-8d23-c2657ae7616b",
    aud: "authenticated",
    role: "authenticated",
    email: "ricky@heartofcygnus.com",
    email_confirmed_at: "2025-04-19T21:58:10.134079Z",
    phone: "",
    confirmation_sent_at: "2025-04-19T21:57:11.55724Z",
    confirmed_at: "2025-04-19T21:58:10.134079Z",
    recovery_sent_at: "2025-04-19T21:59:00.787141Z",
    last_sign_in_at: "2025-04-19T22:00:50.956924306Z",
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {
      email: "ricky@heartofcygnus.com",
      email_verified: true,
      firstName: "Ricky",
      lastName: "Lane",
      mailingList: true,
      notifyList: false,
      phone_verified: false,
      sub: "fbbd5edf-1bb9-4ee4-8d23-c2657ae7616b",
    },
    identities: [
      {
        identity_id: "2428bf3d-3f57-4ccd-9468-04f813ae80a2",
        id: "fbbd5edf-1bb9-4ee4-8d23-c2657ae7616b",
        user_id: "fbbd5edf-1bb9-4ee4-8d23-c2657ae7616b",
        identity_data: {
          captchaToken: null,
          email: "ricky@heartofcygnus.com",
          email_verified: true,
          firstName: "Ricky",
          lastName: "Lane",
          mailingList: true,
          notifyList: false,
          phone_verified: false,
          sub: "fbbd5edf-1bb9-4ee4-8d23-c2657ae7616b",
        },
        provider: "email",
        last_sign_in_at: "2025-04-19T21:57:11.543928Z",
        created_at: "2025-04-19T21:57:11.543979Z",
        updated_at: "2025-04-19T21:57:11.543979Z",
        email: "ricky@heartofcygnus.com",
      },
    ],
    created_at: "2025-04-19T21:57:11.537924Z",
    updated_at: "2025-04-19T22:00:50.959376Z",
    is_anonymous: false,
  },
};

function LoggedInUser() {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/account/login");
    }
  }, [session, router]);

  const {
    user: { user_metadata: userdata },
  } = session;

  return (
    <div className="w-3/4 bg-primary-800 col-span-2">
      {userdata && <div className="w-full">{userdata?.firstName}</div>}
    </div>
  );
}

export default LoggedInUser;
