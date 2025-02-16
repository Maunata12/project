import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  alarms: {
    sunday: [{ time: String, medication: String }],
    monday: [{ time: String, medication: String }],
    tuesday: [{ time: String, medication: String }],
    wednesday: [{ time: String, medication: String }],
    thursday: [{ time: String, medication: String }],
    friday: [{ time: String, medication: String }],
    saturday: [{ time: String, medication: String }],
  },
});

const Medical =
  mongoose.models.Medical || mongoose.model("Medical", medicalSchema);
export default Medical;
