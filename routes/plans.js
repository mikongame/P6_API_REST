import express from "express";
import Plan from "../models/Plan.js";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find().populate("tasks");
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los planes", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate("tasks");
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el plan", error });
  }
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
  try {
    const { tasks, ...rest } = req.body; // evitamos modificar el array de tareas
    const updated = await Plan.findByIdAndUpdate(req.params.id, rest, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Plan no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el plan", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

    await Task.deleteMany({ _id: { $in: plan.tasks } });

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan y tareas asociadas eliminados correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el plan", error });
  }
});

router.post("/:id/tasks", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

    const { taskId } = req.body;
    if (!taskId) return res.status(400).json({ message: "taskId es requerido" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    if (!plan.tasks.includes(taskId)) {
      plan.tasks.push(taskId);
      await plan.save();
    }

    const updatedPlan = await Plan.findById(req.params.id).populate("tasks");
    res.json(updatedPlan);

  } catch (error) {
    res.status(500).json({ message: "Error al añadir tarea al plan", error });
  }
});

router.delete("/:planId/tasks/:taskId", async (req, res) => {
  try {
    const { planId, taskId } = req.params;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

    const taskIndex = plan.tasks.indexOf(taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "La tarea no está asociada al plan" });
    }

    plan.tasks.splice(taskIndex, 1);
    await plan.save();

    const updatedPlan = await Plan.findById(planId).populate("tasks");
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: "Error al quitar la tarea del plan", error });
  }
});

export default router;
