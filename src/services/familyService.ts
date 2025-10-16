import { Family, User, FamilyUser} from "@prisma/client"
import { UserSafe } from "../types/user";

import { FamilyRepository } from "../repositories/familyRepository";
import { userService } from "./userService";
import { AuthorizationService } from "./authorizationService";
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { TokenData } from "../types/auth";

export class FamilyService {

    // Servicios
    private authorizationService = new AuthorizationService();
    private userService = new userService();

    async createFamily(name: string, token: TokenData): Promise<Family> {
        if (!name || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        console.log(token.userId)

        const family = await FamilyRepository.createFamily(name);

        console.log(family.idFamily)

        await this.joinFamily(token.userId, family.idFamily, 2); // El rol 2 es de admin

        //await FamilyUserRepository.userJoinFamily(token.userId, family.idFamily, 2);

        return family;
    }

    async getFamily(idFamily: string): Promise<Family> {
        if (!idFamily) {
            throw new Error("El id de la familia es obligatorio");
        }

        const familia = await FamilyRepository.getFamily(idFamily);
        
        if (!familia) {
            throw new Error("No se encontró la familia con el id proporcionado");
        }

        return familia;
    }

    private async getFamiliesByIDs(familiesIDs: {idFamily: string}[]): Promise<Family[]> {

        const families: Family[] = await Promise.all(
            familiesIDs.map(async (family) => {
                const familyData = await this.getFamily(family.idFamily);
                return familyData;
            })
        );

        return families;
    }

    async getFamiliesByUser(token: TokenData): Promise<Family[]> {
        if (!token) {
            throw new Error("El token es obligatorio");
        }

        const familiesIDs = await FamilyUserRepository.getFamiliesByUser(token.userId);

        const families = await this.getFamiliesByIDs(familiesIDs)

        return families;
    }

    private async getUsersByIDs(membersIDs: {idUser: string}[]): Promise<UserSafe[]> {

        const members: UserSafe[] = await Promise.all(
            membersIDs.map(async (member) => {
                const user = await this.userService.getUser(member.idUser);
                return user;
            })
        );
        
        return members
    }

    async getMembers(idFamily: string, token: TokenData): Promise<UserSafe[]> {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.getFamily(idFamily); // Verifica si la familia existe

        await this.authorizationService.assertUserInFamily(token, idFamily)

        const membersIDs = await FamilyUserRepository.getFamilyMembers(idFamily);
        
        const members = await this.getUsersByIDs(membersIDs)

        return members;
    }

    async joinFamily(idUser: string, idFamily: string, idRol: number) {
        if (!idFamily || !idUser || !idRol) {
            throw new Error("Todos los campos son obligatorios");
        }

        await FamilyUserRepository.userJoinFamily(idUser, idFamily, idRol);
    }

    async addPointsToMemberInFamily(idFamily: string, idUser: string, points: number){
        if (!idFamily || !idUser || !points) {
            throw new Error("Todos los campos son obligatorios");
        }
        
        await FamilyUserRepository.addPointsToMemberInFamily(idFamily, idUser, points);
    }


    async deleteFamily(idFamily: string, token: TokenData): Promise<Family | null> {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserIsAdmin(token, idFamily)

        return await FamilyRepository.deleteFamily(idFamily);
    }
}