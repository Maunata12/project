"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Use next-auth to get the current session

const CalorieCounting = () => {
  const [dailyLimit, setDailyLimit] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [calorieData, setCalorieData] = useState([]);
  const { data: session } = useSession(); // Get session data

  const fetchCalorieData = async () => {
    if (!session || !session.user) return; // If no session, don't fetch data

    try {
      const response = await fetch("/api/calories/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.email}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCalorieData(data); // Set calorie data for the logged-in user
      } else {
        console.error("Error fetching calorie data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching calorie data:", error);
    }
  };

  useEffect(() => {
    fetchCalorieData(); // Call when component is mounted or session is available
  }, [session]); // Fetch data when session changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { dailyLimit, caloriesConsumed };

    try {
      const response = await fetch("/api/calories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setDailyLimit(0);
        setCaloriesConsumed(0);
        fetchCalorieData(); // Re-fetch after successful submission
        setMessage(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while saving the data.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Calorie Tracker
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-sm"
      >
        <div className="mb-4">
          <label htmlFor="dailyLimit" className="text-lg font-medium">
            Daily Calorie Limit
          </label>
          <input
            id="dailyLimit"
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter daily calorie limit"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="caloriesConsumed" className="text-lg font-medium">
            Calories Consumed
          </label>
          <input
            id="caloriesConsumed"
            type="number"
            value={caloriesConsumed}
            onChange={(e) => setCaloriesConsumed(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter calories consumed"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white text-xl font-semibold rounded-lg hover:bg-blue-600"
        >
          Save Calorie Data
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Calorie Logs</h3>
        <div className="space-y-4">
          {calorieData.map((log) => (
            <div
              key={log._id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <p>
                <strong>Day:</strong> {log.dayOfWeek}
              </p>
              <p>
                <strong>Daily Limit:</strong> {log.dailyLimit} calories
              </p>
              <p>
                <strong>Calories Consumed:</strong> {log.caloriesConsumed}{" "}
                calories
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalorieCounting;
