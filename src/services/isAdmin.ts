import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { TokenData } from "./tokenData";

export async function isAdmin(token: TokenData, familyId: string): Promise <Boolean>{
    const familyUserRepository = new FamilyUserRepository()
    const roleRepository = new RoleRepository()

    const idRole = await familyUserRepository.getFamilyUserRole(token.userId, familyId);
    
    if (!idRole){
        throw new Error("El usuario no pertenece a la familia")
    }

    const roleName = await roleRepository.getRole(idRole)

    return roleName === "admin"
}