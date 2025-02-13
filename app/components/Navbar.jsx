"use client"; 

import React from 'react';
import Link from 'next/link'; 

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-bold hover:text-gray-400">
          HealthBuddy
        </Link>

        {/* Navbar Menu */}
        <ul className="flex space-x-6">
          <li className="navbar-item">
            <Link href="/medical" className="text-white hover:text-gray-400">Medical intake</Link>
          </li>
          <li className="navbar-item">
            <Link href="/routine" className="text-white hover:text-gray-400">Fitness routine</Link>
          </li>
          <li className="navbar-item">
            <Link href="/counting" className="text-white hover:text-gray-400">Calorie Counting</Link>
          </li>
        
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
