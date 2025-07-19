## Planify Backend – API REST + WebSockets

Aplicación backend para organizar planes colaborativos (como *La Noche de la Hamburguesa*) mediante tareas asignadas, en tiempo real.

---

### Stack Tecnológico

* **Node.js** + **Express**
* **MongoDB Atlas** + Mongoose
* **Socket.io** (WebSockets)
* **dotenv**, **readline**

---

### Funcionalidades

* CRUD completo para:

  * `Plan`: planificación colaborativa (con título y descripción)
  * `Task`: tareas dentro de un plan (con estado `done`)
* Relación entre modelos: un plan tiene un array de tareas
* Comunicación en tiempo real vía Socket.io (`new-task`, `task-added`)
* Script de semilla interactivo (`node seed.js`) con opción de datos predefinidos o personalizados

---

### Comandos útiles

```bash
npm install       # Instalar dependencias
npm run dev       # Iniciar el servidor con nodemon
node seed.js      # Poblar la base de datos con planes y tareas
```

---

### Endpoints REST principales

| Método | Ruta         | Descripción                                |
| ------ | ------------ | ------------------------------------------ |
| GET    | `/plans`     | Obtener todos los planes (con tareas)      |
| GET    | `/plans/:id` | Obtener un plan por ID                     |
| POST   | `/plans`     | Crear un nuevo plan                        |
| PUT    | `/plans/:id` | Editar un plan (sin eliminar tareas)       |
| DELETE | `/plans/:id` | Eliminar un plan                           |
| GET    | `/tasks`     | Listar todas las tareas                    |
| POST   | `/tasks`     | Crear una nueva tarea y añadirla a un plan |
| PUT    | `/tasks/:id` | Editar una tarea                           |
| DELETE | `/tasks/:id` | Eliminar una tarea y quitarla del plan     |

---

### Conexión a MongoDB Atlas

* La base de datos tiene acceso público activado (`0.0.0.0/0`) para facilitar la corrección.
* Se utiliza un usuario **temporal y limitado** con permisos de escritura.
* La URI de conexión debe colocarse en el archivo `.env`.

📄 `.env` incluido por requerimiento de evaluación

Este repositorio contiene el archivo `.env` real para facilitar la corrección del proyecto.  
El usuario de MongoDB Atlas utilizado es **temporal y con permisos limitados**, y será eliminado después de la entrega.

> ⚠️ En entornos reales, nunca se deben subir credenciales sensibles a un repositorio público.


---

### Semilla

```bash
node seed.js
```

Permite elegir entre:

* Población automática con ejemplos clásicos (hamburguesas, cervezas, etc.)
* Introducción personalizada de planes y tareas por consola

---

### Inspiración pedagógica

Este proyecto toma como referencia el ejercicio realizado en otro curso llamado **“La Noche de la Hamburguesa”**, donde se explora la relación entre modelos en MongoDB mediante una estructura narrativa: un plan (evento o noche especial) que contiene múltiples tareas organizativas.




