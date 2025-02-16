import mongoose from "mongoose";

const fitnessLog = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fitnessId: {
      type: String,
      required: true,
    },
    dayOfWeek: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.fitnessLog ||
  mongoose.model("fitnessLog", fitnessLog);
