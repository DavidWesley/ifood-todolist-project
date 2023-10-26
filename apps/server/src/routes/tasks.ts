import type { FastifyInstance } from "fastify"

// import authServices from "@/services/auth.ts"
import tasksServices from "@/services/tasks.ts"
import usersServices from "@/services/users.ts"

export async function tasksRoutes(app: FastifyInstance) {
    // app.addHook("onRequest", authServices.checkUserIsAuthenticated)

    app.get(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById],
        },
        tasksServices.getAllUserTasks
    )

    app.post(
        "/:userId",
        {
            preHandler: [usersServices.checkUserExistsById],
        },
        tasksServices.createTask
    )

    app.get(
        "/:userId/:taskId",
        {
            preHandler: [usersServices.checkUserExistsById, tasksServices.checkTaskExists, tasksServices.checkTaskOwnerIsAuthenticated],
        },
        tasksServices.getTaskById
    )

    app.delete(
        "/:userId/:taskId",
        {
            preHandler: [usersServices.checkUserExistsById, tasksServices.checkTaskExists, tasksServices.checkTaskOwnerIsAuthenticated],
        },
        tasksServices.deleteTaskById
    )

    app.put(
        "/:userId/:taskId",
        {
            preHandler: [usersServices.checkUserExistsById, tasksServices.checkTaskExists, tasksServices.checkTaskOwnerIsAuthenticated],
        },
        tasksServices.updateTask
    )
}
