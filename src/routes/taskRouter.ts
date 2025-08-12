import { Router, Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { autenticarToken } from "../middleware/authMiddleware";

const taskService = new TaskService();
export const taskRouter = Router();

// Crear tarea
taskRouter.post("/create", autenticarToken, async (req: Request, res: Response) => {
    const { name, description, familyId, difficulty } = req.body;
    const token = req.user!;

    try {
        const task = await taskService.createTask(name, description, familyId, difficulty, token);
        res.status(201).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al crear tarea';
        res.status(401).send({ error: message });
    }
});

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
taskRouter.get("/underreview/admin/:familyId", autenticarToken, async (req: Request, res: Response) => {
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

// Auto-asignar tarea a usuario
taskRouter.post("/autoassign/:idTask", autenticarToken, async (req: Request, res: Response) => {
    const { idTask } = req.params;
    const token = req.user!;

    try {
        const task = await taskService.autoAssignTask(idTask, token);
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
        const task = await taskService.unassignTask(idTask, token);
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
        const task = await taskService.completeTaskAsUser(idTask, token);
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
        const task = await taskService.completeTaskAsAdmin(idTask, token);
        res.status(200).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al completar tarea como admin';
        res.status(401).send({ error: message });
    }
});

// Asignar tarea a usuario (admin)
taskRouter.post("/assign/:idTask/:idUser", autenticarToken, async (req: Request, res: Response) => {
    const { idTask, idUser } = req.params;
    const token = req.user!;

    try {
        const task = await taskService.assingTaskToUser(idTask, idUser, token);
        res.status(200).send({ task });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al asignar tarea';
        res.status(401).send({ error: message });
    }
});
