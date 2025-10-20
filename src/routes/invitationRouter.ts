import {Router, Request, Response} from "express"

import { InvitationService } from "../services/invitationService";

import { authenticationService } from "../services/authenticationService";

import { TokenData } from "../types/auth";

import { autenticarToken } from "../middleware/authMiddleware";

const invitationService = new InvitationService();

export const invitationRouter = Router();

invitationRouter.post("/create", autenticarToken,  async (req: Request, res: Response) => {
    const { familyId, username } = req.body;
    const token = req.user!;
        
    try {
        const invitation = await invitationService.createInvitation(familyId, username, token)
        res.status(201).send({ invitation })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al crear invitación';
        res.status(401).send({ error: message });
    }
})

invitationRouter.get("/get", autenticarToken,  async (req: Request, res: Response) => {
    const token = req.user!;
        
    try {
        const invitation = await invitationService.getInvitationsSentToUser(token)
        res.status(200).send({ invitation })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener invitaciones';
        res.status(401).send({ error: message });
    }
})

invitationRouter.get("/sent/:id", autenticarToken,  async (req: Request, res: Response) => {
    const id = req.params.id;
    const token = req.user!;
        
    try {
        const invitations = await invitationService.getInvitationsSentFromFamily(id, token)
        res.status(200).send({ invitations })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener invitaciones';
        res.status(401).send({ error: message });
    }
})

invitationRouter.post("/accept/:id", autenticarToken,  async (req: Request, res: Response) => {
    const id = req.params.id;
    const token = req.user!;
        
    try {
        const invitation = await invitationService.acceptInvitation(id, token)
        res.status(200).send({ invitation })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al acceptar invitación';
        res.status(401).send({ error: message });
    }
})

invitationRouter.post("/reject/:id", autenticarToken,  async (req: Request, res: Response) => {
    const id = req.params.id;
    const token = req.user!;
        
    try {
        const invitation = await invitationService.rejectInvitation(id, token)
        res.status(200).send({ invitation })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al acceptar invitación';
        res.status(401).send({ error: message });
    }
})

//REJECT INVITATION