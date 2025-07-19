import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  done: { type: Boolean, default: false },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true }
}, {
  timestamps: true
});

export default mongoose.model("Task", taskSchema);
