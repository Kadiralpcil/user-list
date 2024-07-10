"use client";
import { FaHome } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signOut } from "next-auth/react";

const Topbar = () => {
  const router = useRouter();
  const handleLogout = () => {
    signOut();
    // router.push("/login");
  };

  return (
    <div className="w-full flex bg-slate-400 justify-between py-3 px-2">
      <FaHome
        className="text-white text-[2rem] cursor-pointer hover:scale-110"
        onClick={() => router.push("/users")}
      />
      <Link href="https://github.com/Kadiralpcil" target="blank">
        <FaGithub className="text-white text-[2rem] cursor-pointer hover:scale-110" />
      </Link>
      <IoIosLogOut
        className="text-white text-[2rem] cursor-pointer hover:scale-110"
        onClick={handleLogout}
      />
    </div>
  );
};

export default Topbar;
