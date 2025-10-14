import { InvitationRepository } from "../repositories/invitationRepository";
import { TokenData } from "../types/auth";
import { AuthorizationService } from "./authorizationService";
import { userService } from "./userService";
import { FamilyService } from "./familyService";
import { Invitation } from "@prisma/client";
import { webSocketService } from "../ws/webSocketService";

export class InvitationService {

    // Servicios
    private authorizationService = new AuthorizationService();
    private userService = new userService();
    private familyService = new FamilyService();

    async createInvitation(idFamily: string, idUserInvited: string, token: TokenData): Promise<Invitation> {
        if (!idFamily || !idUserInvited || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserIsAdmin(token, idFamily)

        await this.userService.getUser(idUserInvited); // Verifica si el usuario existe

        await this.familyService.getFamily(idFamily); // Verifica si la familia existe

        const invitation = await InvitationRepository.createInvitation(idFamily, idUserInvited, token.userId);

        webSocketService.emitPrivateMessage(idUserInvited, {type: "Invitation"})

        return invitation;
    }


    async getInvitation(idInvitation: string): Promise<Invitation> {
        if (!idInvitation) {
            throw new Error("Todos los campos son obligatorios");
        }

        const invitation = await InvitationRepository.getInvitation(idInvitation);

        if (!invitation) {
            throw new Error("Invitación inexistente");
        }

        return invitation;
    }

    async getInvitationsSentToUser(token: TokenData): Promise<Invitation[]> {
        if (!token) {
            throw new Error("El token es obligatorio");
        }

        const invitations = await InvitationRepository.getInvitationsSentToUserByUserId(token.userId);

        await InvitationRepository.markInvitationsAsSeen(token.userId);

        return invitations;
    }

    async getUnseenInvitationsCount(token: TokenData): Promise<number> {
        if (!token) {
            throw new Error("El token es obligatorio");
        }

        const count = await InvitationRepository.getUnseenInvitationsCount(token.userId);
        
        return count;
    }

    async getInvitationsSentFromFamily(idFamily: string, token: TokenData): Promise<Invitation[]> {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserIsAdmin(token, idFamily)

        const invitations = await InvitationRepository.getInvitationsSentFromFamily(idFamily);

        return invitations;
    }


    async acceptInvitation(idInvitation: string, token: TokenData) {
        if (!idInvitation || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const invitation = await this.getInvitation(idInvitation);

        if (invitation.idUserInvited !== token.userId) {
            throw new Error("El usuario no es el destinatario de la invitación");
        }

        const updatedInvitation = await InvitationRepository.acceptInvitation(idInvitation);

        await this.familyService.joinFamily(token.userId, invitation.idFamily, 1); // El rol 1 es de miembro

        return updatedInvitation;
    }

    async rejectInvitation(idInvitation: string, token: TokenData): Promise<Invitation> {
        if (!idInvitation || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const invitation = await this.getInvitation(idInvitation);

        if (invitation.idUserInvited !== token.userId) {
            throw new Error("El usuario no es el destinatario de la invitación");
        }

        const rejectedInvitation = await InvitationRepository.rejectInvitation(idInvitation);
        
        return rejectedInvitation;
    }
}