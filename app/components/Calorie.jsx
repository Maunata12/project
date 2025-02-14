// pages/calorie-tracker.js (or a component within a page)
import { useState, useEffect } from 'react';
import dbConnect from '../lib/mongodb';
import UserCalorie from '../models/UserCalorie';

export default function CalorieTracker() {
  const [targetCalories, setTargetCalories] = useState(2000); // Default
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [calorieData, setCalorieData] = useState([]); // Store fetched data
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await dbConnect(); // Connect to MongoDB
      const data = await UserCalorie.find({ userId: 'your_user_id' }); // Replace with actual user ID
      setCalorieData(data);

      // Calculate total consumed calories for the current date (if needed)
      const today = new Date();
      const todayData = data.filter(item => item.date.toDateString() === today.toDateString());
      const totalConsumed = todayData.reduce((sum, item) => sum + item.consumedCalories, 0);
      setConsumedCalories(totalConsumed);
    }
    fetchData();
  }, []);

  const handleCalorieIntake = async (e) => {
    e.preventDefault();
    const newIntake = parseInt(e.target.calories.value, 10) || 0;

    await dbConnect();
    await UserCalorie.create({
      userId: 'your_user_id', // Replace with actual user ID
      targetCalories,
      consumedCalories: newIntake, // Store individual intakes
    });

    setConsumedCalories(prev => prev + newIntake);
    e.target.reset(); // Clear the form

    // Recalculate and update data
    const updatedData = await UserCalorie.find({ userId: 'your_user_id' });
    setCalorieData(updatedData);

  };

  useEffect(() => {
    if (consumedCalories > targetCalories) {
      setSuggestion("You've exceeded your calorie goal. Consider a light walk or reducing your next meal.");
    } else if (consumedCalories > targetCalories * 0.8) {
      setSuggestion("You're close to your calorie goal. Be mindful of your intake.");
    } else {
      setSuggestion(null);
    }
  }, [consumedCalories, targetCalories]);

  // ... (JSX for displaying data, form, and suggestion) ...

  return (
    <div>
      {/* Target Calorie Input */}
      <label htmlFor="target">Target Calories:</label>
      <input
        type="number"
        id="target"
        value={targetCalories}
        onChange={(e) => setTargetCalories(parseInt(e.target.value, 10) || 0)}
      />

      {/* Calorie Intake Form */}
      <form onSubmit={handleCalorieIntake}>
          <label htmlFor="calories">Calories:</label>
          <input type="number" id="calories" name="calories" required />
          <button type="submit">Add Calories</button>
      </form>

      <p>Consumed Calories: {consumedCalories}</p>
      {suggestion && <p>{suggestion}</p>}

      {/* Display Calorie Data (optional) */}
      <ul>
        {calorieData.map((item) => (
          <li key={item._id}>
            {item.date.toDateString()}: {item.consumedCalories}
          </li>
        ))}
      </ul>
    </div>
  );
}