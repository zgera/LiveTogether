import { InvitationRepository } from "../repositories/invitationRepository";
import { FamilyUserRepository } from "../repositories/familyUserRepository";
import { TokenData } from "./tokenData";
import { AuthorizationService } from "./authorizationService";

export class InvitationService {

    private authorizationService = new AuthorizationService();
    private repository = new InvitationRepository();
    private familyUserRepository = new FamilyUserRepository();

    async createInvitation(idFamily: string, idUserInvited: string, token: TokenData) {
        if (!idFamily || !idUserInvited || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (!await this.authorizationService.isAdmin(token, idFamily)) {
            throw new Error("El usuario debe ser admin para realizar esta tarea");
        }

        try {
            const invitation = await this.repository.createInvitation(idFamily, idUserInvited, token.userId);
            return invitation;
        } catch (err: any) {
            throw new Error("Ocurrió un error al crear la invitación. Intente más tarde");
        }
    }

    async acceptInvitation(idInvitation: string, token: TokenData) {
        if (!idInvitation || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const invitation = await this.repository.getInvitation(idInvitation);

        if (!invitation) {
            throw new Error("Invitación inexistente");
        }

        if (invitation.idUserInvited !== token.userId) {
            throw new Error("El usuario no es el destinatario de la invitación");
        }

        try {
            const updatedInvitation = await this.repository.acceptInvitation(idInvitation);
            await this.familyUserRepository.userJoinFamily(token.userId, invitation.idFamily);
            return updatedInvitation;
        } catch (err: any) {
            throw new Error("Ocurrió un error al aceptar la invitación. Intente más tarde");
        }
    }

    async rejectInvitation(idInvitation: string, token: TokenData) {
        if (!idInvitation || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const invitation = await this.repository.getInvitation(idInvitation);

        if (!invitation) {
            throw new Error("Invitación inexistente");
        }

        if (invitation.idUserInvited !== token.userId) {
            throw new Error("El usuario no es el destinatario de la invitación");
        }

        try {
            await this.repository.rejectInvitation(idInvitation);
            return { message: "Invitación rechazada correctamente" };
        } catch (err: any) {
            throw new Error("Ocurrió un error al rechazar la invitación. Intente más tarde");
        }
    }

    async getInvitationsSentToUserByUserId(token: TokenData) {
        try {
            const invitations = await this.repository.getInvitationsSentToUserByUserId(token.userId);
            return invitations;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las invitaciones. Intente más tarde");
        }
    }

    async getInvitationsSendedFromFamily(idFamily: string, token: TokenData) {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (!await this.authorizationService.isAdmin(token, idFamily)) {
            throw new Error("El usuario debe ser admin para realizar esta tarea");
        }

        try {
            const invitations = await this.repository.getInvitationsSendedFromFamily(idFamily);
            return invitations;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las invitaciones. Intente más tarde");
        }
    }
}