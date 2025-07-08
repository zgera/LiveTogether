import { Family } from "@prisma/client"
import { User } from "@prisma/client";

import { FamilyRepository } from "../repositories/familyRepository";
import { userService } from "./userService";
import { AuthorizationService } from "./authorizationService";
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { TokenData } from "./tokenData";

export class FamilyService {

    private repository = new FamilyRepository();
    private authorizationService = new AuthorizationService();
    private userService = new userService();
    private familyUserRepository = new FamilyUserRepository();

    async createFamily(name: string, token: TokenData): Promise<Family> {
        if (!name || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        try {
            const family = await this.repository.createFamily(name);
            await this.familyUserRepository.userJoinFamily(token.userId, family.idFamily, 2); // El rol 2 es de admin
            return family;
        } catch (err: any) {
            throw new Error("Ocurrió un error al crear la familia. Intente más tarde");
        }
    }

    async getFamily(idFamily: string): Promise<Family> {
        if (!idFamily) {
            throw new Error("El id de la familia es obligatorio");
        }

        const familia = await this.repository.getFamily(idFamily);
        
        if (!familia) {
            throw new Error("No se encontró la familia con el id proporcionado");
        }

        return familia;
    }

    async getFamiliesByUser(token: TokenData): Promise<Family[]> {
        if (!token) {
            throw new Error("El token es obligatorio");
        }

        const familiesIDs = await this.familyUserRepository.getFamiliesByUser(token.userId);

        const families: Family[] = await Promise.all(
            familiesIDs.map(async (family) => {
                const familyData = await this.getFamily(family.idFamily);
                return familyData;
            })
        );

        return families;
    }

    async getMembers(idFamily: string, token: TokenData): Promise<User[]> {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.getFamily(idFamily); // Verifica si la familia existe

        if (!await this.authorizationService.isInFamily(token, idFamily)) {
            throw new Error("El usuario no pertenece a la familia");
        }

        const membersIDs = await this.familyUserRepository.getFamilyMembers(idFamily);
        const members = await Promise.all(
            membersIDs.map(async (member) => {
                const user = await this.userService.getUser(member.idUser);
                return user;
            })
        );

        return members;
    }

    async deleteFamily(idFamily: string, token: TokenData): Promise<Family | null> {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (!await this.authorizationService.isAdmin(token, idFamily)) {
            throw new Error("El usuario debe ser admin para realizar esta tarea");
        }

        return await this.repository.deleteFamily(idFamily);
    }
}