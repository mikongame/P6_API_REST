import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from "readline";
import Plan from "./models/Plan.js";
import Task from "./models/Task.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB para semilla");

    await Task.deleteMany();
    await Plan.deleteMany();

    const useDefault = (await ask("¿Usar datos predefinidos? (s/n): ")).toLowerCase() === "s";

    if (useDefault) {
      // === Datos predefinidos (planificación de una noche) ===
      const plan1 = await Plan.create({ title: "Noche de la Hamburguesa", description: "Plan para cenar juntos en casa de Juan" });
      const plan2 = await Plan.create({ title: "Fin de semana en la montaña", description: "Organización previa a la escapada" });

      const task1 = await Task.create({ name: "Comprar pan de hamburguesa", plan: plan1._id });
      const task2 = await Task.create({ name: "Traer cerveza", plan: plan1._id });
      const task3 = await Task.create({ name: "Revisar ruta GPS", plan: plan2._id });

      await Plan.findByIdAndUpdate(plan1._id, { $addToSet: { tasks: { $each: [task1._id, task2._id] } } });
      await Plan.findByIdAndUpdate(plan2._id, { $addToSet: { tasks: task3._id } });

      console.log("🌱 Base de datos poblada con planes por defecto");
    } else {
      // === Datos personalizados ===
      const numPlanes = parseInt(await ask("¿Cuántos planes quieres crear?: "), 10);

      for (let i = 0; i < numPlanes; i++) {
        const title = await ask(`Título del plan ${i + 1}: `);
        const description = await ask(`Descripción del plan ${i + 1}: `);

        const plan = await Plan.create({ title, description });

        const numTareas = parseInt(await ask(`¿Cuántas tareas para "${title}"?: `), 10);
        const taskIds = [];

        for (let j = 0; j < numTareas; j++) {
          const name = await ask(` - Nombre de la tarea ${j + 1}: `);
          const task = await Task.create({ name, plan: plan._id });
          taskIds.push(task._id);
        }

        await Plan.findByIdAndUpdate(plan._id, { $addToSet: { tasks: { $each: taskIds } } });
        console.log(`✅ Plan "${title}" creado con ${taskIds.length} tareas.`);
      }
    }

    console.log("✅ Seed finalizado");
    rl.close();
    process.exit();
  } catch (error) {
    console.error("❌ Error al ejecutar semilla:", error);
    rl.close();
    process.exit(1);
  }
};

seed();
