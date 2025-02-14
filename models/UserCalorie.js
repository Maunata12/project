import mongoose from 'mongoose';

const userCalorieSchema = new mongoose.Schema({
  userId: String, // Or ObjectId if you have user authentication
  date: { type: Date, default: Date.now }, // Date of the calorie intake
  targetCalories: Number, // User's daily calorie goal
  consumedCalories: Number, // Calories consumed on this date
});

const UserCalorie = mongoose.models.UserCalorie || mongoose.model('UserCalorie', userCalorieSchema);

export default UserCalorie;