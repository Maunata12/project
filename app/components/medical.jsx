"use client";
import React, { useState, useEffect, useRef } from 'react';

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

  const soundRef = useRef(null);
  const [soundLoaded, setSoundLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [initialLoadChecked, setInitialLoadChecked] = useState(false);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [intervalId, setIntevalId] = useState(null);

  useEffect(() => {
    const audio = new Audio('/alarm-sound.mp3');
    soundRef.current = audio;

    audio.oncanplaythrough = () => {
      console.log('Sound loaded successfully');
      setSoundLoaded(true);
      if (!initialLoadChecked) {
        alert("Audio loaded successfully!");
      }
    };

    audio.onerror = (error) => {
      console.error('Error loading sound:', error);
      alert("Error loading alarm sound. Please check the file path and ensure it's a valid MP3.");
      if (!initialLoadChecked) {
        alert("Error loading audio!");
      }
    };

    if (!initialLoadChecked) {
      setInitialLoadChecked(true);
      if (audio.readyState >= 2) {
        setSoundLoaded(true);
        alert("Audio loaded successfully!");
      } else if (audio.readyState < 2) {
        alert("Audio is still loading or could not be loaded. Check your file path and browser console.");
      }
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!userInteracted) return;

    const id = setInterval(() => {
      const now = new Date();
      const currentTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      Object.keys(alarms).forEach(day => {
        alarms[day].forEach(alarm => {
          if (alarm.time === currentTimeString && soundRef.current && soundLoaded && !alarmPlaying) {
            setAlarmPlaying(true); // Set alarm as playing
            soundRef.current.play().catch((err) => {
              console.error('Error playing sound:', err);
              if (err.message && err.message.includes('Autoplay')) {
                alert("Autoplay is blocked. Please interact with the page (click/touch) to enable sound.");
              } else {
                alert("Error playing alarm.");
              }
            }).finally(() => setAlarmPlaying(false)); // Reset after play attempt
            alert(`It's time for your medication: ${alarm.medication} for ${day.charAt(0).toUpperCase() + day.slice(1)}!`);
          }
        });
      });
    }, 60000);
    setIntevalId(id);

    return () => clearInterval(id);
  }, [alarms, soundLoaded, userInteracted, alarmPlaying]);

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

  const handleUserInteraction = () => {
    setUserInteracted(true);
  };

  const stopAlarm = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
    setAlarmPlaying(false);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg" onClick={handleUserInteraction}>
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
        <button
          className="stop-button bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 ml-4"
          onClick={stopAlarm}
          disabled={!alarmPlaying} // Disable if alarm is not playing
        >
          Stop Alarm
        </button>
      </div>
    </div>
  );
};

export default Medical;