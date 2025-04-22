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
    <div className="flex items-center gap-4 z-10 mr-1">
      <Image
        src={logo}
        height="40"
        width="40"
        alt="Kick Start Records Logo"
        priority
      />
      {/*rubikDoodleShadow.className*/}
      <div>
        <span
          className={`text-3xl/6 font-semibold align-middle pb-2 text-primary-950 dark:text-primary-50`}
        >
          kickstart
        </span>
        <span
          className={`text-3xl/6 font-semibold align-middle pb-2 text-accent-600`}
        >
          records
        </span>
      </div>
    </div>
  );
}

export default Logo;
