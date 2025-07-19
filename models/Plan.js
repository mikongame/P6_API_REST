import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
});

export default mongoose.model("Plan", planSchema);
