import { Note } from "@prisma/client";

import { NoteRepository } from "../repositories/noteRepository";

import { AuthorizationService } from "./authorizationService";
import { TokenData } from "../types/auth";

export class noteService {

    private authorizationService = new AuthorizationService()

    async getNote(idNote: string): Promise<Note> {
        const note = await NoteRepository.getNote(idNote)

        if (!note) {
            throw new Error("No existe esa nota")
        }

        return note
    }
    
    async createNote(token: TokenData, name: string, familyId: string, desc: string): Promise<Note> {
        
        await this.authorizationService.assertUserInFamily(token, familyId)

        const note = await NoteRepository.createNote(name, familyId, desc, token.userId)

        return note
    }

    async getNotes(token: TokenData, familyId: string): Promise<Note[]>{

        await this.authorizationService.assertUserInFamily(token, familyId)

        const notes = await NoteRepository.getNotes(familyId)

        return notes
    }

    async deleteNote(token: TokenData, noteId: string): Promise<Note> {

        const note = await this.getNote(noteId)

        await this.authorizationService.assertUserIsAdmin(token, note.familyId)

        const noteDeleted = await NoteRepository.deleteNote(noteId)

        return noteDeleted
    }
}