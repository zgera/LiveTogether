import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { TokenData } from "../types/auth";

export class AuthorizationService {

    async isInFamily(token: TokenData, familyId: string): Promise<boolean> {
        const members = await FamilyUserRepository.getFamilyMembers(familyId);

        const userInFamily = members.some(member => member.idUser === token.userId);

        return userInFamily;
    }

    async assertUserInFamily(token: TokenData, familyId: string): Promise<void> {
        const isMember = await this.isInFamily(token, familyId);
        if (!isMember) {
            throw new Error("El usuario no pertenece a la familia");
        }
    }

    async isAdmin(token: TokenData, familyId: string): Promise<boolean> {

        const idRole = await FamilyUserRepository.getFamilyUserRole(token.userId, familyId);

        if (!idRole) {
            throw new Error("El usuario no pertenece a la familia");
        }

        const roleName = await RoleRepository.getRole(idRole)
    
        return roleName === "admin"
    }

    async assertUserIsAdmin(token: TokenData, familyId: string): Promise<void> {
        const isAdmin = await this.isAdmin(token, familyId);
        if (!isAdmin) {
            throw new Error("El usuario no tiene permisos de administrador");
        }
    }
}