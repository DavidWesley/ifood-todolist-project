import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

import { verifyPassword } from "@/lib/crypto.ts"
import { ENV } from "@/lib/env.ts"
import usersRepository from "@/repositories/users.ts"
import { loginUserBodySchema } from "@/schemas/zod.ts"

//// HOOKS ////
const checkUserIsAuthenticated = async (request: FastifyRequest, response: FastifyReply) => {
    const scope = checkUserIsAuthenticated.name.toString()
    const authHeader = request.headers["authorization"]
    const token = authHeader?.split(" ", 2).at(-1)

    if (!token) {
        return response.status(StatusCodes.UNAUTHORIZED).send({ error: { message: "Acesso negado!", scope } })
    }

    try {
        const secret = ENV["JWT_SECRET"]
        jwt.verify(token, secret)
    } catch (err) {
        response.status(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "O Token é inválido!",
                scope,
            },
        })
    }
}

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

    const user = await usersRepository.findOne({
        email: (value: string) => value === body.data.email,
    })

    if (user === null) {
        return response.status(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "Usuário não encontrado",
                scope,
            },
        })
    }

    if (verifyPassword(body.data.password, { salt: user.salt, hash: user.hash }) === false) {
        return response.status(StatusCodes.UNAUTHORIZED).send({
            error: {
                message: "Incorrect password or username",
                scope,
            },
        })
    }

    try {
        const token = jwt.sign({ data: user }, ENV["JWT_SECRET"], { subject: user.id, expiresIn: "1h" })

        return response.status(StatusCodes.OK).send({ data: { token } })
    } catch (err) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                message: err,
                scope,
            },
        })
    }
}

const authServices = {
    checkUserIsAuthenticated,
    loginUser,
}

export default authServices
