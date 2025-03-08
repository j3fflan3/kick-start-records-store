import localFont from "next/font/local";
import { Rubik_Doodle_Shadow } from "next/font/google";
import "@/app/_styles/global.css";
import Header from "@/app/_components/Header";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["symbols"],
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Kick Start Records",
  description:
    "Online record store specializing in Metal and Rock, featuring Indie and Unsigned bands 🤘🏻",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubikDoodleShadow.variable} antialiased`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
