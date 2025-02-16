import mongoose from "mongoose";

const calorieLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dailyLimit: { type: Number, required: true },
    caloriesConsumed: { type: Number, required: true },
    dayOfWeek: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CalorieLog ||
  mongoose.model("CalorieLog", calorieLogSchema);
