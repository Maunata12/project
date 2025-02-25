"use client";
import React, { useState, useEffect } from "react";
import { FaSpinner, FaExclamationTriangle, FaLock } from "react-icons/fa";
import UserDetail from "@/app/components/User";

function Check({ sub }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  async function fetchRole() {
    try {
      const res = await fetch("/api/user/isadmin");
      if (!res.ok) {
        throw new Error("Failed to fetch role");
      }
      const data = await res.json();
      setIsAdmin(data.role === "admin");
    } catch (err) {
      console.error("Error fetching role:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <p className="mt-4 text-xl text-blue-500">Loading, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <FaExclamationTriangle className="text-4xl text-red-500" />
        <p className="mt-4 text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <FaLock className="text-4xl text-gray-700" />
        <p className="mt-4 text-xl text-gray-700">Unauthorized Access</p>
        <p className="mt-2 text-md text-gray-500">
          You do not have the necessary permissions to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 w-full">
      {sub === "users" ? (
        <UserDetail />
      ) : (
        <div className="text-center text-xl text-gray-500">
          404: Page not found.
        </div>
      )}
    </div>
  );
}

export default Check;
