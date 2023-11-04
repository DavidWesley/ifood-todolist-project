import type { FastifyInstance } from "fastify"

import authServices from "@/services/auth.ts"
import usersServices from "@/services/users.ts"

export async function usersRoutes(app: FastifyInstance) {
    app.addHook("onRequest", authServices.authenticateAccessToken)

    app.get(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById, authServices.checkUserIsAuthenticated],
        },
        usersServices.getUserById
    )

    app.delete(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById, authServices.checkUserIsAuthenticated],
        },
        usersServices.deleteUserById
    )

    app.put(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById, authServices.checkUserIsAuthenticated],
        },
        usersServices.updateUser
    )

    // IMPORTANT: Usar apenas para fins de teste, no futuro essa rota será removida
    app.get("/", {}, usersServices.getAllUser)
}
