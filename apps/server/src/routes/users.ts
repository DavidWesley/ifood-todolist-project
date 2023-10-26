import type { FastifyInstance } from "fastify"

import usersServices from "@/services/users.ts"

export async function usersRoutes(app: FastifyInstance) {
    // app.addHook("onRequest", authServices.checkUserIsAuthenticated)

    app.get(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById],
        },
        usersServices.getUserById
    )

    app.delete(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById],
        },
        usersServices.deleteUserById
    )

    app.put(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById],
        },
        usersServices.updateUser
    )

    // IMPORTANT: Usar apenas para fins de teste, no futuro essa rota será removida
    app.get("/", {}, usersServices.getAllUser)
}
