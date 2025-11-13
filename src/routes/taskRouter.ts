import { Router, Request, Response } from "express";
import { TaskService, TaskAssignmentService, TaskCompletionService } from "../services/taskService";
import { autenticarToken } from "../middleware/authMiddleware";

const taskService = new TaskService();
const taskAssignmentService = new TaskAssignmentService();
const taskCompletionService = new TaskCompletionService();
export const taskRouter = Router();

// Crear tarea
taskRouter.post("/create", autenticarToken, async (req: Request, res: Response) => {
    const { name, description, familyId, difficulty, deadline } = req.body;
    const token = req.user!;

    try {
        console.log(deadline); 
        const parsedDeadline = new Date(deadline);
        const task = await taskService.createTask(name, description, familyId, difficulty, parsedDeadline, token);
        res.status(201).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al crear tarea';
        res.status(401).send({ error: message });
    }
});


    // GET /api/task/getTask/:idTask
    // 📘 Descripción:
    // Obtiene una tarea específica por su ID. 
    // Devuelve la información completa de la tarea, incluyendo:
    // - Datos del creador (`creator`)
    // - Datos del usuario asignado (`assignedTo`)
    // - Dificultad asociada (`difficulty`)
    //
    // Requiere autenticación mediante token.
    //
    // 🧩 Parámetros de ruta:
    // :idTask — ID único de la tarea a obtener.
    //
    // 🧩 Ejemplo de request:
    // GET /api/task/getTask/clzb4x12f0000abc123xyz
    //
    // ✅ Ejemplo de response (200 OK):
    // {
    //   "task": {
    //     "idTask": "clzb4x12f0000abc123xyz",
    //     "name": "Lavar los platos",
    //     "description": "Lavar todos los platos del almuerzo",
    //     "completedByUser": false,
    //     "completedByAdmin": false,
    //     "familyId": "clzb3wq5d0001abc123xyz",
    //     "creatorId": "clzb2vr9e0002abc123xyz",
    //     "assignedId": "clzb2zj9f0003abc123xyz",
    //     "idDifficulty": 2,
    //     "createdAt": "2025-11-03T14:32:45.123Z",
    //     "deadline": "2025-11-04T18:00:00.000Z",
    //     "penalized": false,
    //     "notifiedDeadlineSoon": false,
    //
    //     "creator": {
    //       "idUser": "clzb2vr9e0002abc123xyz",
    //       "username": "valen123",
    //       "firstName": "Valentín",
    //       "lastName": "Gerakios"
    //     },
    //     "assignedTo": {
    //       "idUser": "clzb2zj9f0003abc123xyz",
    //       "username": "martina",
    //       "firstName": "Martina",
    //       "lastName": "Pérez"
    //     },
    //     "difficulty": {
    //       "idDifficulty": 2,
    //       "name": "Media",
    //       "points": 20
    //     }
    //   }
    // }
    //
taskRouter.get("/getTask/:idTask", autenticarToken, async (req: Request, res: Response) => {
    const { idTask } = req.params
    const token = req.user!

    try {
        const task = await taskService.getTask(idTask)
        res.status(200).send({ task })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener tarea';
        res.status(401).send({ error: message });
    }
})

// Obtener tareas no asignadas
taskRouter.get("/unassigned/:familyId", autenticarToken, async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const token = req.user!;

    try {
        const tasks = await taskService.getTasksUnassigned(familyId, token);
        res.status(200).send({ tasks });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener tareas no asignadas';
        res.status(401).send({ error: message });
    }
});

// Obtener tareas asignadas y no completadas por el usuario
taskRouter.get("/assigned/uncompleted/:familyId", autenticarToken, async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const token = req.user!;

    try {
        const tasks = await taskService.getTasksAssignedUncompletedByUser(familyId, token);
        res.status(200).send({ tasks });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener tareas';
        res.status(401).send({ error: message });
    }
});

// Obtener tareas bajo revisión del usuario
taskRouter.get("/underreview/user/:familyId", autenticarToken, async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const token = req.user!;

    try {
        const tasks = await taskService.getTasksUnderReviewByUser(familyId, token);
        res.status(200).send({ tasks });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener tareas bajo revisión';
        res.status(401).send({ error: message });
    }
});

// Obtener progreso de las tareas del dia de un usuario (user)
taskRouter.get("/dailyprogress/:familyId", autenticarToken, async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const token = req.user!;

    try {
        const progress = await taskService.getProgressOfUserTasks(familyId, token);
        res.status(200).send({ progress });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener el progreso diario de tareas';
        res.status(401).send({ error: message });
    }
});

//Obtener progreso de las tareas del dia de la familia (user)
taskRouter.get("/familydailyprogress/:familyId", autenticarToken, async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const token = req.user!;
    try {
        const progress = await taskService.getProgressOfFamilyTasks(familyId, token);
        res.status(200).send({ progress });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener el progreso diario de tareas de la familia';
        res.status(401).send({ error: message });
    }
});

// Obtener tareas asignadas y no completadas (admin)
taskRouter.get("/assigned/uncompleted/admin/:familyId", autenticarToken, async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const token = req.user!;

    try {
        const tasks = await taskService.getTasksAssignedUncompleted(familyId, token);
        res.status(200).send({ tasks });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener tareas';
        res.status(401).send({ error: message });
    }
});

// Obtener tareas bajo revisión (admin)
taskRouter.get("/underreview/:familyId", autenticarToken, async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const token = req.user!;

    try {
        const tasks = await taskService.getTasksUnderReview(familyId, token);
        res.status(200).send({ tasks });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener tareas bajo revisión';
        res.status(401).send({ error: message });
    }
});

// Obtener historial de tareas de un usuario (user)
taskRouter.get("/history/:familyId", autenticarToken,  async (req: Request, res: Response) => {
    const { familyId } = req.params;
    const token = req.user!;

    try {
        const tasks = await taskService.getUserHistoryTasks(familyId, token);
        res.status(200).send({ tasks });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener el historial de tareas';
        res.status(401).send({ error: message });
    }
});
    
// Auto-asignar tarea a usuario
taskRouter.post("/autoassign/:idTask", autenticarToken, async (req: Request, res: Response) => {
    const { idTask } = req.params;
    const token = req.user!;

    try {
        const task = await taskAssignmentService.autoAssignTask(idTask, token);
        res.status(200).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al asignar tarea';
        res.status(401).send({ error: message });
    }
});

// Desasignar tarea (admin)
taskRouter.post("/unassign/:idTask", autenticarToken, async (req: Request, res: Response) => {
    const { idTask } = req.params;
    const token = req.user!;

    try {
        const task = await taskAssignmentService.unassignTask(idTask, token);
        res.status(200).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al desasignar tarea';
        res.status(401).send({ error: message });
    }
});

// Completar tarea como usuario
taskRouter.post("/complete/user/:idTask", autenticarToken, async (req: Request, res: Response) => {
    const { idTask } = req.params;
    const token = req.user!;

    try {
        const task = await taskCompletionService.completeTaskAsUser(idTask, token);
        res.status(200).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al completar tarea';
        res.status(401).send({ error: message });
    }
});

// Completar tarea como admin
taskRouter.post("/complete/admin/:idTask", autenticarToken, async (req: Request, res: Response) => {
    const { idTask } = req.params;
    const token = req.user!;

    try {
        const task = await taskCompletionService.completeTaskAsAdmin(idTask, token);
        res.status(200).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al completar tarea como admin';
        res.status(401).send({ error: message });
    }
});

taskRouter.post("/revertcompletion/:idTask", autenticarToken, async (req: Request, res: Response) => {
    const { idTask } = req.params;
    const token = req.user!;

    try {
        const task = await taskCompletionService.rejectTaskCompletion(idTask, token);
        res.status(200).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al revertir la tarea';
        res.status(401).send({ error: message });
    }
});

// Asignar tarea a usuario (admin)
taskRouter.post("/assign/:idTask/:idUser", autenticarToken, async (req: Request, res: Response) => {
    const { idTask, idUser } = req.params;
    const token = req.user!;

    try {
        const task = await taskAssignmentService.assingTaskToUser(idTask, idUser, token);
        res.status(200).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al asignar tarea';
        res.status(401).send({ error: message });
    }
});

// Asignar tareas automaticamente (admin)

taskRouter.post("/automaticallyAsign/:idFamily", autenticarToken, async(req: Request, res: Response) => {
    const { idFamily } = req.params
    const token = req.user!;

    try {
        const task = await taskAssignmentService.automaticallyAsignTasks(token, idFamily)
        res.status(200).send({ task })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al asignar tareas automaticamente';
        res.status(401).send({ error: message });
    }
})
