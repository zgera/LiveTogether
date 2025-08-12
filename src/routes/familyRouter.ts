import {Router, Request, Response} from "express"

import { FamilyService } from "../services/familyService";

import { autenticarToken } from "../middleware/authMiddleware";

const familyService = new FamilyService();

export const familyRouter = Router();

familyRouter.post("/create", autenticarToken,  async (req: Request, res: Response) => {
    const { name } = req.body;
    const token = req.user!;
        
    try {
        const family = await familyService.createFamily(name, token)
        res.status(201).send({ family })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al crear familia';
        res.status(401).send({ error: message });
    }
})

familyRouter.get("/checkfamilies", autenticarToken,  async (req: Request, res: Response) => {
    const token = req.user!;
        
    try {
        const families = await familyService.getFamiliesByUser(token)
        res.status(200).send({ families })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener las familias';
        res.status(401).send({ error: message });
    }
})

familyRouter.get("/members/:id", autenticarToken,  async (req: Request, res: Response) => {
    const id = req.params.id;
    const token = req.user!;
        
    try {
        const members = await familyService.getMembers(id, token)
        res.status(200).send({ members })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener los miembors de la familia';
        res.status(401).send({ error: message });
    }
})

//REVISAR QUERIEEEEEEEEEEEEEEEEEES
/* familyRouter.post("/delete/:id", autenticarToken,  async (req: Request, res: Response) => {
    const id = req.params.id;
    const token = req.user!;
        
    try {
        const family = await familyService.deleteFamily(id, token)
        res.status(204).send({ family })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener eliminar la familia';
        res.status(401).send({ error: message });
    }
}) */