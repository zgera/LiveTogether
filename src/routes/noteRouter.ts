import { Router, Request, Response } from "express"

import { noteService } from "../services/noteService";

import { autenticarToken } from "../middleware/authMiddleware";

const NoteService = new noteService()

export const noteRouter = Router()

// POST /api/note/create
// ---------------------------------------------------------
// 📘 Descripción:
// Crea una nueva nota asociada a una familia determinada.
// Solo los usuarios autenticados pueden crear notas.
// Se utiliza el `familyId` para vincular la nota a una familia,
// y el token del usuario se usa para registrar al creador.
//
// 🧩 Request body:
// {
//   "name": "Lista de compras",
//   "desc": "Comprar leche, pan y frutas",
//   "familyId": "clz9xqv5d0001abc123xyz"
// }
//
// ✅ Response (200 OK):
// {
//   "note": {
//     "idNote": "clz9xr7p60002abc123xyz",
//     "familyId": "clz9xqv5d0001abc123xyz",
//     "creatorId": "clz9xn2k40001abc123xyz",
//     "name": "Lista de compras",
//     "desc": "Comprar leche, pan y frutas"
//   }
// }
noteRouter.post("/create", autenticarToken, async(req: Request, res: Response) => {
    const { name, familyId, desc } = req.body
    const token = req.user!

    try {
        const note = await NoteService.createNote(token, name, familyId, desc)
        res.status(200).send({ note })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al crear la nota';
        res.status(401).send({ error: message });
    }
})


// GET /api/note/get/:familyId
// ---------------------------------------------------------
// 📘 Descripción:
// Devuelve todas las notas asociadas a una familia específica.
// Solo los miembros autenticados de esa familia pueden acceder.
// Incluye la información del usuario creador de cada nota.
//
// 🧩 Parámetros de ruta:
// :familyId — ID de la familia a la que pertenecen las notas.
//
// ✅ Ejemplo de response (200 OK):
// {
//   "notes": [
//     {
//       "idNote": "clz9xr7p60002abc123xyz",
//       "familyId": "clz9xqv5d0001abc123xyz",
//       "creatorId": "clz9xn2k40001abc123xyz",
//       "name": "Lista de compras",
//       "desc": "Comprar leche, pan y frutas",
//       "user": {
//         "idUser": "clz9xn2k40001abc123xyz",
//         "username": "valen123",
//         "firstName": "Valentín",
//         "lastName": "Gerakios"
//       }
//     },
//     {
//       "idNote": "clz9xrz6e0003abc123xyz",
//       "familyId": "clz9xqv5d0001abc123xyz",
//       "creatorId": "clz9xpjk20002abc123xyz",
//       "name": "Reunión familiar",
//       "desc": "Domingo a las 18hs",
//       "user": {
//         "idUser": "clz9xpjk20002abc123xyz",
//         "username": "lucasg",
//         "firstName": "Lucas",
//         "lastName": "Gómez"
//       }
//     }
//   ]
// }
//
noteRouter.get("/get/:familyId", autenticarToken, async(req: Request, res: Response) => {
    const { familyId } = req.params
    const token = req.user!

    try {
        const notes = await NoteService.getNotes(token, familyId)
        res.status(200).send({ notes })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener notas';
        res.status(401).send({ error: message });
    }
})


// POST /api/note/delete/:idNote
// ---------------------------------------------------------
// 📘 Descripción:
// Elimina una nota específica por su ID.
// Solo el creador de la nota o un miembro autorizado de la familia
// puede eliminarla. Requiere autenticación.
//
// 🧩 Parámetros de ruta:
// :idNote — ID de la nota a eliminar.
//
// ✅ Ejemplo de response (200 OK):
// {
//   "note": {
//     "idNote": "clz9xr7p60002abc123xyz",
//     "familyId": "clz9xqv5d0001abc123xyz",
//     "creatorId": "clz9xn2k40001abc123xyz",
//     "name": "Lista de compras",
//     "desc": "Comprar leche, pan y frutas"
//   }
// }
//
noteRouter.post("/delete/:idNote", autenticarToken, async(req: Request, res: Response) => {
    const { idNote } = req.params
    const token = req.user!

    try {
        const note = await NoteService.deleteNote(token, idNote)
        res.status(200).send({ note })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al eliminar la nota';
        res.status(401).send({ error: message });
    }
})

