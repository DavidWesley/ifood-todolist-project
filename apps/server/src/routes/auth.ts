import type { FastifyInstance } from "fastify"

import authServices from "@/services/auth.ts"
import usersServices from "@/services/users.ts"

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", usersServices.createUser)

    app.post(
        "/login",
        {
            preHandler: [usersServices.checkUserExistsByProperties],
        },
        authServices.loginUser
    )
}
