import express from "express";
import Task from "../models/Task.js";
import Plan from "../models/Plan.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tasks = await Task.find().populate("plan");
  res.json(tasks);
});

router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id).populate("plan");
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
  res.json(task);
});

router.post("/", async (req, res) => {
  try {
    const { name, planId } = req.body;
    const task = await Task.create({ name, plan: planId });
    await Plan.findByIdAndUpdate(planId, { $addToSet: { tasks: task._id } });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error al crear tarea", error });
  }
});

router.put("/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Tarea no encontrada" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    await Plan.findByIdAndUpdate(task.plan, { $pull: { tasks: task._id } });
  }
  res.json({ message: "Tarea eliminada" });
});

export default router;
