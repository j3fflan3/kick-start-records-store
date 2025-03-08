import Link from "next/link";
import Image from "next/image";
import logo from "@/app/public/vinyl_album.png";
import { Rubik_Doodle_Shadow } from "next/font/google";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["symbols"],
});

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      {/* Image 1) automatically serves correctly sized images
      in modern formats (WebP) on demand, 2) Prevents layout 
      shifts by requiring exact height and width, and 3) automatically
      lazy loads images.
      */}
      {/* <Image src="/logo.png" height="60" width="60" alt="The Wild Oasis logo" /> */}
      {/* When we import the image like this, nextjs allows us to add some
      additional properties, like quality (which controls the size, e.g., kb) */}
      <Image
        src={logo}
        height="50"
        width="50"
        quality={80}
        alt="Kick Start Records Logo"
      />
      <span
        className={`${rubikDoodleShadow.className} text-5xl font-semibold text-primary-100`}
      >
        KICK START RECORDS
      </span>
    </Link>
  );
}

export default Logo;
