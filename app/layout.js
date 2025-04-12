import localFont from "next/font/local";
import { Rubik_Doodle_Shadow } from "next/font/google";
import "@/app/_styles/global.css";
import Header from "@/app/_components/Header";
import { CartProvider } from "./_contexts/CartProvider";
import { SessionProvider } from "./_contexts/SessionProvider";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["symbols"],
});
const geistSans = localFont({
  src: "./_fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./_fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Kick Start Records",
  description:
    "Online record store featuring Indie and Unsigned Metal, Punk, and Rock music. Horns Up! 🤘🏻",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/vinyl-record.png" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubikDoodleShadow.variable} antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            <Header />
            <div className="flex-1 px-8 py-4 grid">
              <main className="max-w-7xl mx-auto w-full">{children}</main>
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
