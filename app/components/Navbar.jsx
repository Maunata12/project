"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown menu
  const userImageRef = useRef(null); // Reference for the user image

  // Handle dropdown toggle when user clicks on their profile image
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown if the user clicks outside of it
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !userImageRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  // Adding event listener for clicks outside of the dropdown
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
          <li className="navbar-item">
            <Link href="/medical" className="text-white hover:text-gray-400">
              Medical intake
            </Link>
          </li>
          <li className="navbar-item">
            <Link href="/fitness" className="text-white hover:text-gray-400">
              Fitness routine
            </Link>
          </li>
          <li className="navbar-item">
            <Link href="/counting" className="text-white hover:text-gray-400">
              Calorie Counting
            </Link>
          </li>

          {/* Login Button or User Image */}
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
                {/* User Image */}
                <img
                  referrerPolicy="no-referrer"
                  ref={userImageRef} // Attach the ref to the user image
                  src={session.user.image}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border-2 border-white cursor-pointer"
                  onClick={toggleDropdown}
                />
                <p className="ml-2 text-white">{session.user.username}</p>

                {/* Dropdown for Sign-out */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef} // Attach the ref to the dropdown menu
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
