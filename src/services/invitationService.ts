import { InvitationRepository } from "../repositories/invitationRepository";
import { TokenData } from "../types/auth";
import { AuthorizationService } from "./authorizationService";
import { userService } from "./userService";
import { FamilyService } from "./familyService";
import { Invitation } from "@prisma/client";

export class InvitationService {

    //Repostiorio
    private repository = new InvitationRepository();

    // Servicios
    private authorizationService = new AuthorizationService();
    private userService = new userService();
    private familyService = new FamilyService();

    async createInvitation(idFamily: string, idUserInvited: string, token: TokenData) {
        if (!idFamily || !idUserInvited || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserIsAdmin(token, idFamily)

        await this.userService.getUser(idUserInvited); // Verifica si el usuario existe

        await this.familyService.getFamily(idFamily); // Verifica si la familia existe

        try {
            const invitation = await this.repository.createInvitation(idFamily, idUserInvited, token.userId);
            return invitation;
        } catch (err: any) {
            throw new Error("Ocurrió un error al crear la invitación. Intente más tarde");
        }
    }


    async getInvitation(idInvitation: string): Promise<Invitation> {
        if (!idInvitation) {
            throw new Error("Todos los campos son obligatorios");
        }

        const invitation = await this.repository.getInvitation(idInvitation);

        if (!invitation) {
            throw new Error("Invitación inexistente");
        }

        return invitation;
    }

    async getInvitationsSentToUser(token: TokenData): Promise<Invitation[]> {
        try {
            const invitations = await this.repository.getInvitationsSentToUserByUserId(token.userId);
            return invitations;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las invitaciones. Intente más tarde");
        }
    }

    async getInvitationsSentFromFamily(idFamily: string, token: TokenData): Promise<Invitation[]> {
        if (!idFamily || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        await this.authorizationService.assertUserIsAdmin(token, idFamily)

        try {
            const invitations = await this.repository.getInvitationsSendedFromFamily(idFamily);
            return invitations;
        } catch (err: any) {
            throw new Error("Ocurrió un error al obtener las invitaciones. Intente más tarde");
        }
    }


    async acceptInvitation(idInvitation: string, token: TokenData) {
        if (!idInvitation || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const invitation = await this.getInvitation(idInvitation);

        if (invitation.idUserInvited !== token.userId) {
            throw new Error("El usuario no es el destinatario de la invitación");
        }

        try {
            const updatedInvitation = await this.repository.acceptInvitation(idInvitation);
            await this.familyService.joinFamily(token.userId, invitation.idFamily, 1); // El rol 1 es de miembro
            return updatedInvitation;
        } catch (err: any) {
            throw new Error("Ocurrió un error al aceptar la invitación. Intente más tarde");
        }
    }

    async rejectInvitation(idInvitation: string, token: TokenData): Promise<Invitation> {
        if (!idInvitation || !token) {
            throw new Error("Todos los campos son obligatorios");
        }

        const invitation = await this.getInvitation(idInvitation);

        if (invitation.idUserInvited !== token.userId) {
            throw new Error("El usuario no es el destinatario de la invitación");
        }

        try {
            const rejectedInvitation = await this.repository.rejectInvitation(idInvitation);
            return rejectedInvitation;
        } catch (err: any) {
            throw new Error("Ocurrió un error al rechazar la invitación. Intente más tarde");
        }
    }
}