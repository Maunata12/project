"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hide, setHide] = useState(false); // <-- Added state for hide
  const dropdownRef = useRef(null);
  const userImageRef = useRef(null);
  const path = usePathname();

  // Handle dropdown toggle when user clicks on their profile image
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown if the user clicks outside of it
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      userImageRef.current &&
      !userImageRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  // Adding event listener for clicks outside of the dropdown
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // If on /admin route, do not render the Navbar
  useEffect(() => {
    if (path.includes("/admin")) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [path]);

  if (hide) {
    return null;
  }

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-2xl font-bold hover:text-gray-400"
        >
          HealthBuddy
        </Link>

        {/* Navbar Menu */}
        <ul className="flex space-x-6 items-center">
          <li className="navbar-item flex items-center gap-4">
            <Link href="/medical" className="text-white hover:text-gray-400">
              Medical intake
            </Link>
            <Link href="/counting" className="text-white hover:text-gray-400">
             Calorie Counting
            </Link>
            <Link href="/fitness" className="text-white hover:text-gray-400">
              Fitness Tracker
            </Link>
          </li>
          {/* Additional menu items can be added here */}

          <li className="navbar-item flex items-center">
            {!session ? (
              <Link
                href="/login"
                className="text-white border-2 px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
              >
                Login
              </Link>
            ) : (
              <div className="relative flex items-center">
                <img
                  ref={userImageRef}
                  src={session.user.image}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border-2 border-white cursor-pointer"
                  onClick={toggleDropdown}
                />
                <p className="ml-2 text-white">{session.user.username}</p>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-10 right-0 mt-2 w-40 bg-gray-800 text-white border rounded-md shadow-lg"
                  >
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
