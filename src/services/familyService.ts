import { Family } from "@prisma/client"
import { UserSafe } from "../types/user";

import { FamilyRepository } from "../repositories/familyRepository";
import { userService } from "./userService";
import { AuthorizationService } from "./authorizationService";
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { TokenData } from "../types/auth";

export class FamilyService {

    // Repositorios
    private repository = new FamilyRepository();
    private familyUserRepository = new FamilyUserRepository();

    // Servicios
    private authorizationService = new AuthorizationService();
    private userService = new userService();

    async createFamily(name: string, token: TokenData): Promise<Family> {
        if (!name || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        try {
            const family = await this.repository.createFamily(name);
            await this.joinFamily(token.userId, family.idFamily, 2); // El rol 2 es de admin
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

    async getMembers(idFamily: string, token: TokenData): Promise<UserSafe[]> {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.getFamily(idFamily); // Verifica si la familia existe

        await this.authorizationService.assertUserInFamily(token, idFamily)

        const membersIDs = await this.familyUserRepository.getFamilyMembers(idFamily);
        const members: UserSafe[] = await Promise.all(
            membersIDs.map(async (member) => {
                const user = await this.userService.getUser(member.idUser);
                return user;
            })
        );

        return members;
    }

    async joinFamily(idUser: string, idFamily: string, idRol: number) {
        if (!idFamily || !idUser || !idRol) {
            throw new Error("Todos los campos son obligatorios");
        }
        try {
            await this.familyUserRepository.userJoinFamily(idUser, idFamily, idRol);
        } catch (err: any) {
            throw new Error("Ocurrió un error al unirse a la familia. Intente más tarde");
        }
    }

    async addPointsToMemberInFamily(idFamily: string, idUser: string, points: number){
        if (!idFamily || !idUser || !points) {
            throw new Error("Todos los campos son obligatorios");
        }
        try {
            await this.familyUserRepository.addPointsToMemberInFamily(idFamily, idUser, points);
        } catch (err: any) {
            throw new Error("Ocurrió un error al agregar puntos al miembro de la familia. Intente más tarde");
        }
    }


    async deleteFamily(idFamily: string, token: TokenData): Promise<Family | null> {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserIsAdmin(token, idFamily)

        return await this.repository.deleteFamily(idFamily);
    }
}