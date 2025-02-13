"use client";
import React, { useState, useEffect } from 'react';

const Medical = () => {
  const [alarms, setAlarms] = useState({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

  const [sound, setSound] = useState(null);

  // Initialize the alarm sound
  useEffect(() => {
    const audio = new Audio('/alarm-sound.mp3');
    setSound(audio);

    // Ensure the sound is loaded before playing
    audio.oncanplaythrough = () => {
      console.log('Sound loaded successfully');
    };

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Check for alarms every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const currentTimeString = currentTime.toTimeString().split(' ')[0]; // Format: HH:MM:SS

      // Check each day for alarms
      Object.keys(alarms).forEach(day => {
        alarms[day].forEach(alarm => {
          if (alarm.time === currentTimeString && sound) {
            // Only play sound if it has been loaded
            sound.play().catch((err) => {
              console.error('Error playing sound:', err);
            });
            alert(`It's time for your medication: ${alarm.medication} for ${day.charAt(0).toUpperCase() + day.slice(1)}!`);
          }
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [alarms, sound]);

  const addAlarm = (day) => {
    setAlarms(prev => ({
      ...prev,
      [day]: [...prev[day], { time: '', medication: '' }],
    }));
  };

  const updateAlarm = (day, index, field, value) => {
    const updatedAlarms = [...alarms[day]];
    updatedAlarms[index][field] = value;
    setAlarms({ ...alarms, [day]: updatedAlarms });
  };

  const deleteAlarm = (day, index) => {
    const updatedAlarms = alarms[day].filter((_, idx) => idx !== index);
    setAlarms({ ...alarms, [day]: updatedAlarms });
  };

  const saveAllAlarms = () => {
    if (Object.values(alarms).flat().some(alarm => alarm.time === '' || alarm.medication === '')) {
      alert("Please fill in all fields before saving.");
      return;
    }
    console.log(alarms);
    alert('All alarms saved successfully!');
  };

  const renderAlarms = (day) => {
    return alarms[day].map((alarm, index) => (
      <div key={index} className="alarm-item mb-3 flex gap-2 items-center">
        <input
          type="time"
          className="form-input p-2 rounded-md border border-gray-300 w-1/4"
          placeholder="Set Alarm"
          value={alarm.time}
          onChange={(e) => updateAlarm(day, index, 'time', e.target.value)}
        />
        <input
          type="text"
          className="form-input p-2 rounded-md border border-gray-300 w-1/4"
          placeholder="Add Medication"
          value={alarm.medication}
          onChange={(e) => updateAlarm(day, index, 'medication', e.target.value)}
        />
        <button
          className="delete-button text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
          onClick={() => deleteAlarm(day, index)}
        >
          Delete
        </button>
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Weekly Medication Alarm Schedule</h2>

      <table className="w-full table-auto border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="border p-4 text-center text-lg">Day of the Week</th>
            <th className="border p-4 text-center text-lg">Alarms</th>
            <th className="border p-4 text-center text-lg">Action</th>
          </tr>
        </thead>
        <tbody>
          {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
            <tr key={day}>
              <td className="border p-4 text-center font-medium">{day.charAt(0).toUpperCase() + day.slice(1)}</td>
              <td className="border p-4">
                <div className="alarms">{renderAlarms(day)}</div>
              </td>
              <td className="border p-4 text-center">
                <button
                  className="plus-button text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={() => addAlarm(day)}
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-6">
        <button
          className="save-button bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
          onClick={saveAllAlarms}
        >
          Save All Alarms
        </button>
      </div>
    </div>
  );
};

export default Medical;
