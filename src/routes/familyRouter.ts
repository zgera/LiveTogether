import {Router, Request, Response} from "express"

import { FamilyService } from "../services/familyService";

import { authenticationService } from "../services/authenticationService";

import { TokenData } from "../types/auth";

import { autenticarToken } from "../middleware/authMiddleware";

const familyService = new FamilyService();

export const familyRouter = Router();

familyRouter.post("/create", async (req: Request, res: Response) => {
    const { name } = req.body;
    const access_token = req.cookies?.access_token;

    if (!access_token) throw new Error('Inicie sesión para crear una familia')
        
    try {

        const decoded_access_token = authenticationService.validateToken(access_token);
        const family = familyService.createFamily(name, decoded_access_token)

        res.status(201).send({ family })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al crear familia';
        res.status(401).send({ error: message });
    }
})

//??????????????????????????????????????????????????????????????????????
familyRouter.post("/join", async (req: Request, res: Response) => {
    //TODO RARISIMO (idFamily es una verga, de dónde garcha sale??????)
    /* const { name } = req.body;
    const access_token = req.cookies?.access_token;

    if (!access_token) throw new Error('Inicie sesión para crear una familia')
        
    try {

        const decoded_access_token = authenticationService.validateToken(access_token);
        const family = familyService.createFamily(name, decoded_access_token)

        res.status(201).send({ family })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al crear familia';
        res.status(401).send({ error: message });
    } */
})
