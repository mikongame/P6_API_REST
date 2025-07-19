import express from "express";
import Plan from "../models/Plan.js";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const plans = await Plan.find().populate("tasks");
  res.json(plans);
});

router.get("/:id", async (req, res) => {
  const plan = await Plan.findById(req.params.id).populate("tasks");
  if (!plan) return res.status(404).json({ message: "Plan no encontrado" });
  res.json(plan);
});

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const nuevoPlan = await Plan.create({ title, description });
    res.status(201).json(nuevoPlan);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el plan", error });
  }
});

router.put("/:id", async (req, res) => {
  const { tasks, ...rest } = req.body; // evitamos sobreescribir las tareas
  const updated = await Plan.findByIdAndUpdate(req.params.id, rest, { new: true });
  if (!updated) return res.status(404).json({ message: "Plan no encontrado" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Plan.findByIdAndDelete(req.params.id);
  res.json({ message: "Plan eliminado" });
});

export default router;
