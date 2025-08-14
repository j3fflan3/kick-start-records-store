import Header from "@/src/app/_components/header/Header";
import { CheckoutProvider } from "@/src/app/_contexts/CheckoutProvider";
import { SessionProvider } from "@/src/app/_contexts/SessionProvider";
import "@/src/app/_styles/global.css";
import { Rubik_Doodle_Shadow } from "next/font/google";
import localFont from "next/font/local";
import { DarkModeProvider } from "./_contexts/DarkModeProvider";
import { ShoppingCartProvider } from "./_contexts/ShoppingCartProvider";
import { ShippingProvider } from "./_contexts/ShippingProvider";
import { BillingProvider } from "./_contexts/BillingProvider";

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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubikDoodleShadow.variable} antialiased`}
      >
        <DarkModeProvider>
          <SessionProvider>
            <ShippingProvider>
              <BillingProvider>
                <ShoppingCartProvider>
                  <CheckoutProvider>
                    <Header>
                      <div className="flex-1 px-8 py-4 grid">
                        <main className="max-w-7xl mx-auto w-full">
                          {children}
                        </main>
                      </div>
                    </Header>
                  </CheckoutProvider>
                </ShoppingCartProvider>
              </BillingProvider>
            </ShippingProvider>
          </SessionProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
