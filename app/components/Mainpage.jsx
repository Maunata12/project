"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const HealthBuddy = () => {
  const { data: session } = useSession(); // Get session data to check if the user is logged in

  return (
    <div className="flex bg-gray-200 min-h-screen">
      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">HealthBuddy</h1>
          <p className="mt-4 text-lg text-gray-600">
            Track your daily calories and set medication reminders with
            HealthBuddy. Stay on top of your nutrition and never miss a dose,
            all in one app!
          </p>

          {/* Conditionally render Register Now button based on session */}
          {!session && (
            <Link href="/register">
              <button className="bg-gray-600 text-white rounded-md px-4 py-2 mt-3">
                Register Now
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="flex-none w-1/2 p-10">
        <img
          src="https://health-e.in/wp-content/uploads/2023/12/healthcare-concept-with-futuristic-design-graphics-medical-treatment-icons.webp"
          alt="Healthcare concept illustration"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default HealthBuddy;
