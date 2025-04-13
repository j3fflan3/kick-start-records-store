import Link from "next/link";
import Image from "next/image";
import logo from "@/public/vinyl-record.png";
import { Rubik_Doodle_Shadow } from "next/font/google";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["symbols"],
});

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10 mr-1">
      <Image
        src={logo}
        height="50"
        width="50"
        alt="Kick Start Records Logo"
        priority
      />
      <span
        className={`${rubikDoodleShadow.className} text-4xl font-semibold text-primary-100`}
      >
        KICK START RECORDS
      </span>
    </Link>
  );
}

export default Logo;
