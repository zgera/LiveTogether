import { Note } from "@prisma/client"
 
import { db } from "../db/db"

export class NoteRepository {

    static async createNote(name: string, familyId: string, desc: string, creatorId: string): Promise<Note>{
        return await db.note.create({
            data: {
                name,
                desc,
                familyId,
                creatorId
            }
        })
    }

    static async getNote(idNote: string): Promise< Note | null >{
        return await db.note.findUnique({
            where: {
                idNote
            }, 
            include: {
                user: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })
    }

    static async getNotes(familyId: string): Promise<Note[]>{
        return await db.note.findMany({
            where: {
                familyId
            }, 
            include: {
                user: {
                    select: {
                        idUser: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })
    }

    static async deleteNote(idNote: string): Promise<Note> {
        return await db.note.delete({
            where: {
                idNote
            }
        })
    }
}