"use client";
import Link from "next/link";
import React from "react";
import { MdLogout } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="h-screen w-60 bg-[#121826] text-gray-300 shadow-lg flex flex-col p-6">
      {/* Brand Section */}
      <div className="mb-10">
        <Link href="/">
          <h1 className="text-2xl font-semibold text-[#FFD700] tracking-wide">
            HEALTHBUDDY
          </h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-5">
        <Link
          href="/admin/users"
          className={`flex items-center px-4 py-3 rounded-md transition ${
            pathname === "/admin/users"
              ? "bg-[#1E293B] text-white"
              : "hover:bg-[#1E293B]"
          }`}
        >
          <FaUserCog className="w-6 h-6 mr-3" />
          <span className="text-base">Manage Users</span>
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center px-4 py-3 text-red-400 hover:text-red-300 rounded-md transition"
      >
        <MdLogout className="w-6 h-6 mr-3" />
        <span className="text-base">Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
