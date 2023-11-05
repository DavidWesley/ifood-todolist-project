import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"

import { verifyPassword } from "@/libs/crypto.ts"
import { generateAccessToken, verifyAccessToken } from "@/libs/jwt.ts"
import { loginUserBodySchema, taskAndUserParamsSchema, userParamsSchema, uuidSchema } from "@/schemas/zod.ts"

import { UserModel } from "@/models/users.ts"
import tasksRepository from "@/repositories/tasks.ts"
import usersRepository from "@/repositories/users.ts"

//// HOOKS ////
const authenticateAccessToken = async (request: FastifyRequest, response: FastifyReply) => {
    const scope = authenticateAccessToken.name.toString()
    const authHeader = request.headers.authorization
    const token = authHeader?.split(" ", 2).at(-1)

    if (!token) {
        return response.status(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "O Token é inválido: Sem token",
                scope,
            },
        })
    }

    try {
        const payload = verifyAccessToken(token)
        request["user"] = { id: payload.sub }
    } catch (err) {
        return response.status(StatusCodes.BAD_REQUEST).send({
            error: {
                message: `O Token é invalido: ${(err as Error).message}`,
                scope,
            },
        })
    }
}

const checkUserIsAuthenticated = async (request: FastifyRequest, response: FastifyReply) => {
    authenticateAccessToken(request, response)
    const payloadRequestUserId = uuidSchema.parse((request as FastifyRequest & { user: { id: string } }).user.id)

    const scope = checkUserIsAuthenticated.name.toString()
    const params = userParamsSchema.parse(request.params)

    if (params.userId !== payloadRequestUserId) {
        return response.status(StatusCodes.UNAUTHORIZED).send({
            error: {
                message: "Acesso negado!",
                scope,
            },
        })
    }
}

const checkTaskOwnerIsAuthenticated = async (request: FastifyRequest, response: FastifyReply) => {
    authenticateAccessToken(request, response)
    const payloadRequestUserId = uuidSchema.parse((request as FastifyRequest & { user: { id: string } }).user.id)

    const scope = checkTaskOwnerIsAuthenticated.name.toString()
    const params = taskAndUserParamsSchema.safeParse(request.params)

    if (params.success === false) {
        return response.code(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "Invalid params",
                scope,
            },
        })
    }

    const { userId, taskId } = params.data
    const task = await tasksRepository.findById(taskId)

    if (task?.userId !== userId || task?.userId !== payloadRequestUserId) {
        return response.status(StatusCodes.UNAUTHORIZED).send({
            error: {
                message: "Acesso Negado",
                scope,
            },
        })
    }
}

//// HANDLERS ////
const loginUser = async (request: FastifyRequest, response: FastifyReply) => {
    const scope = loginUser.name.toString()
    const body = loginUserBodySchema.safeParse(request.body)

    if (body.success === false) {
        return response.code(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "Invalid body",
                scope,
            },
        })
    }

    const user = (await usersRepository.findByEmail(body.data.email))!

    if (verifyPassword(body.data.password, { salt: user.salt, hash: user.hash }) === false) {
        return response.status(StatusCodes.UNAUTHORIZED).send({
            error: {
                message: "Incorrect password or username",
                scope,
            },
        })
    }

    try {
        const shareableUserData: Omit<UserModel, "hash" | "salt"> = {
            id: user.id!,
            email: user.email,
            username: user.username,
        }

        const accessToken = generateAccessToken({}, { subject: user.id, expiresIn: "1h" })

        return response.status(StatusCodes.OK).send({ token: accessToken, user: shareableUserData })
    } catch (err) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                message: (err as Error).message,
                scope,
            },
        })
    }
}

const authServices = {
    authenticateAccessToken,
    checkUserIsAuthenticated,
    checkTaskOwnerIsAuthenticated,
    loginUser,
}

export default authServices
