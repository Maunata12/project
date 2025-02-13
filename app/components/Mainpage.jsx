"use client"; // Ensure this component is client-side only

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HealthBuddy = () => {
  return (
    <div className="flex  bg-gray-200">
      {/* Left side with description */}
      <div className="flex-1 flex items-center justify-center  p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">HealthBuddy</h1>
          <p className="mt-4 text-lg text-gray-600">Track your daily calories and set medication reminders with HealthBuddy. Stay on top of your nutrition and never miss a dose, all in one app!</p>
          <button className='bg-gray-600 text-white radius p-2 mt-3' >Register Now</button>
        </div>
      </div>
      <div className="flex-none w-1/2 p-10">
     <img src="https://health-e.in/wp-content/uploads/2023/12/healthcare-concept-with-futuristic-design-graphics-medical-treatment-icons.webp"  alt="" />
      </div>
    </div>
  );
};

export default HealthBuddy;
