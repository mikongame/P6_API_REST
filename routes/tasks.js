import express from "express";
import Task from "../models/Task.js";
import Plan from "../models/Plan.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("plan");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tareas", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("plan");
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar tarea", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, planId } = req.body;
    if (!name || !planId) {
      return res.status(400).json({ message: "Faltan campos requeridos: name y planId" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

    const task = await Task.create({ name, plan: planId });

    await Plan.findByIdAndUpdate(planId, {
      $addToSet: { tasks: task._id }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error al crear tarea", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { plan, ...rest } = req.body; // prevenir cambios de asociación directa
    const updated = await Task.findByIdAndUpdate(req.params.id, rest, { new: true });
    if (!updated) return res.status(404).json({ message: "Tarea no encontrada" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar tarea", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task && task.plan) {
      await Plan.findByIdAndUpdate(task.plan, {
        $pull: { tasks: task._id }
      });
    }
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tarea", error });
  }
});

export default router;
