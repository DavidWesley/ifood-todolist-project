import type { FastifyInstance } from "fastify"

import usersServices from "@/services/users.ts"

export async function usersRoutes(app: FastifyInstance) {
    app.get(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById],
        },
        usersServices.getUserById
    )

    // TODO: implementar login e logout
    // app.post(
    //     "/login",
    //     {
    //         preHandler: [usersServices.checkUserExistsByProperties],
    //     },
    //     async (request, response) => {
    //         return response.status(200)
    //     }
    // )

    app.post(
        "/signup",
        {
            preHandler: [usersServices.checkUserExistsByProperties],
        },
        usersServices.createUser
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
}
