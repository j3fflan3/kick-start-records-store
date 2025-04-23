import logo from "@/public/vinyl-record.png";
import Image from "next/image";

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
