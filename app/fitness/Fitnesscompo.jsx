"use client";
import React, { useState, useEffect } from "react";

function Fitnesscompo() {
  const [activeRouting, setActiveRouting] = useState();
  const [initialActive, setInitialActive] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [fitnessData, setFitnessData] = useState(null);

  const fitnessTasks = [
    {
      id: 1,
      task: "jogging",
      img: "https://static.vecteezy.com/system/resources/previews/022/041/330/non_2x/jogging-icon-style-vector.jpg",
    },
    {
      id: 2,
      task: "swimming",
      img: "https://th.bing.com/th/id/OIP.Izu_c1EJ408BVjHaGX2QAAHaHa?rs=1&pid=ImgDetMain",
    },
    {
      id: 3,
      task: "cycling",
      img: "https://cdn3.iconfinder.com/data/icons/people-activities-scenes/64/bicycle-1024.png",
    },
    {
      id: 4,
      task: "Pushups",
      img: "https://th.bing.com/th/id/OIP.WjcVLCFEM7sQtr6zggYLDQHaHa?rs=1&pid=ImgDetMain",
    },
    {
      id: 5,
      task: "yoga",
      img: "https://static.vecteezy.com/system/resources/previews/000/354/362/original/vector-yoga-icon.jpg",
    },
    {
      id: 6,
      task: "Pull ups",
      img: "https://cdn-icons-png.flaticon.com/512/10175/10175933.png",
    },
    {
      id: 7,
      task: "Plank",
      img: "https://cdn-icons-png.flaticon.com/512/3043/3043253.png",
    },
  ];

  async function saveFitness() {
    try {
      const response = await fetch("/api/fitness/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fitnessId: activeRouting }),
      });

      const result = await response.json();

      if (response.ok) {
        setInitialActive(activeRouting);
        fetchFitness();
        setMessage(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while saving the data.");
      console.error(error);
    }
  }

  async function fetchFitness() {
    try {
      const response = await fetch("/api/fitness/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFitnessData(data);
        if (data) {
          const initialData = data.find(
            (item) =>
              item.dayOfWeek ===
              new Date()
                .toLocaleString("en-US", { weekday: "long" })
                .toLowerCase()
          );
          if (initialData) {
            const numID = parseInt(initialData.fitnessId);
            setInitialActive(numID);
            setActiveRouting(numID);
          }
        }
      } else {
        console.error("Error fetching fitness data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching fitness data:", error);
    }
  }

  useEffect(() => {
    fetchFitness();
  }, []);

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return (
    <div className="flex flex-col gap-3 flex-wrap justify-center items-center p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-4 p-5 bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          What is your fitness routine for today?
        </h2>
        <div className="flex gap-4 flex-wrap justify-center">
          {fitnessTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setActiveRouting(task.id)}
              className={`flex flex-col items-center p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 ${
                activeRouting === task.id
                  ? "bg-blue-100 border-blue-300"
                  : "hover:bg-gray-50"
              }`}
            >
              <img
                src={task.img}
                alt={task.task}
                className="w-24 h-24 object-cover rounded-full"
              />
              <h3 className="text-lg font-semibold mt-2 text-gray-700">
                {task.task}
              </h3>
            </div>
          ))}
        </div>
        {initialActive !== null && initialActive !== activeRouting ? (
          <button
            onClick={saveFitness}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-6 hover:bg-blue-600 transition-all duration-200"
          >
            Update
          </button>
        ) : initialActive === null && initialActive !== activeRouting ? (
          <button
            onClick={saveFitness}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-6 hover:bg-blue-600 transition-all duration-200"
          >
            Add
          </button>
        ) : null}
        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
      <div className="mt-6 bg-white p-5 rounded-lg shadow-lg w-full max-w-4xl">
        <h3 className="text-2xl font-semibold text-blue-600 mb-4">
          Your Weekly Fitness Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => {
            const dayData = fitnessData?.find((item) => item.dayOfWeek === day);
            const task = fitnessTasks.find(
              (task) => task.id === parseInt(dayData?.fitnessId)
            );
            return (
              <div
                key={day}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg"
              >
                <h4 className="text-xl font-semibold text-gray-700 capitalize">
                  {day}
                </h4>
                {task ? (
                  <div className="flex flex-col items-center mt-2">
                    <img
                      src={task.img}
                      alt={task.task}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <p className="text-lg text-gray-600 mt-2">{task.task}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No activity recorded</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Fitnesscompo;
