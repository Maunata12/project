"use client";
import React, { useState, useEffect } from "react";

export function UserDetail() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/user/get");
        const res = await response.json();
        const users = res.users;
        const uniqueUser = users.filter(
          (v, i, a) => a.findIndex((t) => t.email === v.email) === i
        );
        setUsers(uniqueUser);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold mt-10">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold mt-10">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                SN
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Image
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Username
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="px-4 py-2 text-sm text-gray-800">{index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={user.image}
                    alt={user.username}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {user.username}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDetail;
