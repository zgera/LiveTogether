import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { TokenData } from "./tokenData";

export class AuthorizationService {
    private familyUserRepository = new FamilyUserRepository();
    private roleRepository = new RoleRepository();

    async isInFamily(token: TokenData, familyId: string): Promise<boolean> {
        const members = await this.familyUserRepository.getFamilyMembers(familyId);

        const userInFamily = members.some(member => member.idUser === token.userId);

        return userInFamily;
    }

    async isAdmin(token: TokenData, familyId: string): Promise<boolean> {

        const idRole = await this.familyUserRepository.getFamilyUserRole(token.userId, familyId);

        if (!idRole) {
            throw new Error("El usuario no pertenece a la familia");
        }

        const roleName = await this.roleRepository.getRole(idRole)
    
        return roleName === "admin"
    }
}