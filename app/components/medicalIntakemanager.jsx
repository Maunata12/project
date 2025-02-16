"use client";
import { set } from "mongoose";
import { useState, useEffect } from "react";
import { IoTrashBin } from "react-icons/io5";

export default function MedicalIntakeManager() {
  const [alarms, setAlarms] = useState({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

  const [day, setDay] = useState("sunday");
  const [time, setTime] = useState("");
  const [medication, setMedication] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRinging, setIsRinging] = useState(false);
  const [alarmSound, setAlarmSound] = useState(null);
  const [alarmData, setAlarmData] = useState([]);

  const [alarmic, setAlarmic] = useState(false);

  useEffect(() => {
    const sound = new Audio("/alarm.mp3");
    sound.loop = true;
    sound.load();
    sound.oncanplaythrough = () => {
      setAlarmSound(sound);
    };
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/medical/get");
      const data = await res.json();
      if (data.success) {
        setAlarms(
          data.data?.alarms || {
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
          }
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function playAlarm() {
    if (alarmic) {
      setAlarmData({});
      setIsRinging(false);
      return;
    }
    const now = new Date();
    const currentDay = now
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    if (alarms[currentDay]) {
      const foundAlarm = alarms[currentDay].find(
        (alarm) => alarm.time === currentTime
      );

      if (foundAlarm && !alarmic) {
        setIsRinging(true);
        setAlarmData(foundAlarm);

        // if (alarmSound && !alarmSound.paused) {
        //   alarmSound.pause();
        //   alarmSound.currentTime = 0;
        // }

        if (alarmSound) {
          alarmSound
            .play()
            .then(() => console.log("Alarm playing..."))
            .catch((err) => console.error("Audio playback error:", err));
        }
      }
    }
  }

  useEffect(() => {
    if (alarmic) {
      setAlarmData({});
      setIsRinging(false);
      return;
    }
    const interval = setInterval(() => {
      playAlarm();
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, alarmSound, alarmic]);

  const handleAddAlarm = () => {
    if (time && medication) {
      setAlarms((prev) => ({
        ...prev,
        [day]: [...(prev[day] || []), { time, medication }],
      }));
      setTime("");
      setMedication("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/medical/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alarms }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error saving alarms:", error);
      alert("Failed to save alarms.");
    }
  };

  const stopAlarm = () => {
    if (alarmSound) {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }
    setAlarmic(true);
    setIsRinging(false);

    setTimeout(() => {
      setAlarmic(false);
    }, 60000);
  };

  async function deleteData(day, index) {
    // get the day of the alarm
    const alarmDay = alarms[day];

    // remove the alarm with the given time
    const deletableData = alarmDay[index - 1];
    if (!deletableData) return;

    const deleteId = deletableData?._id;

    const res = await fetch(`/api/medical/delete/${deleteId}/${day}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setAlarms((prev) => ({
        ...prev,
        [day]: prev[day].filter((_, i) => i !== index - 1),
      }));
      fetchData();
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">
        Medical Intake Manager
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Set Medical Alarms</h2>
        <div className="mb-2">
          <label className="block font-medium">Select Day:</label>
          <select
            className="border p-2 w-full"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            {Object.keys(alarms).map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block font-medium">Time:</label>
          <input
            type="time"
            className="border p-2 w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium">Medication:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
          />
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={handleAddAlarm}
        >
          Add Alarm
        </button>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 w-full"
          onClick={handleSubmit}
        >
          Save Alarms
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Stored Medical Alarms</h2>
        {loading ? (
          <p>Loading...</p>
        ) : Object.keys(alarms).length === 0 ? (
          <p>No alarms set.</p>
        ) : (
          Object.entries(alarms).map(([day, dayAlarms]) => (
            <div key={day} className="mb-4">
              <h3 className="text-lg font-semibold">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </h3>
              {dayAlarms.length > 0 ? (
                <ul className="list-disc ml-6">
                  {dayAlarms.map((alarm, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <li key={index}>
                        {alarm.time} - {alarm.medication} {index}
                      </li>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded"
                        onClick={() => {
                          deleteData(day, index + 1);
                        }}
                      >
                        <IoTrashBin />
                      </button>
                    </div>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No alarms for this day.</p>
              )}
            </div>
          ))
        )}
      </div>

      {isRinging && (
        <div className="fixed top-0 left-0 h-screen z-50 w-full flex justify-center items-center bg-black/50 backdrop-blur-md text-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-col gap-3">
            <p className="text-lg font-bold">Alarm Ringing!</p>
            <p>
              Time to take your
              {alarmData?.medication} medication .
            </p>
            <button
              className="bg-white text-red-500 px-4 py-2 rounded mt-2"
              onClick={stopAlarm}
            >
              Stop Alarm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
