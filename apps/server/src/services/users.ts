import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"

import { UserModel } from "@/models/users.ts"
import usersRepository from "@/repositories/users.ts"
import { createUserBodySchema, updateUserBodySchema, userParamsSchema } from "@/schemas/zod.ts"

//// HOOKS ////
const checkUserExistsById = async (request: FastifyRequest, response: FastifyReply) => {
    const scope = checkUserExistsById.name.toString()
    const params = userParamsSchema.safeParse(request.params)

    if (params.success === false) {
        return response.code(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "Invalid params",
                scope,
            },
        })
    } else if ((await usersRepository.exists(params.data.userId)) === false) {
        return response.code(StatusCodes.NOT_FOUND).send({
            error: {
                message: "Usuário não encontrado",
                scope,
            },
        })
    }
}

const checkUserExistsByProperties = async (request: FastifyRequest, response: FastifyReply) => {
    const scope = checkUserExistsByProperties.name.toString()
    const body = createUserBodySchema.safeParse(request.body)

    if (body.success === false) {
        return response.code(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "Invalid body",
                scope,
            },
        })
    }

    if (
        (await usersRepository.count({ email: (value: string) => value === body.data.email })) ||
        (await usersRepository.count({ username: (value: string) => value === body.data.username }))
    )
        return response.redirect(StatusCodes.SEE_OTHER, "/")
}

const createUser = async (request: FastifyRequest, response: FastifyReply) => {
    const body = createUserBodySchema.parse(request.body)

    const userId = await usersRepository.create({
        email: body.email,
        username: body.username,
        password: body.password,
    })

    return response.status(StatusCodes.CREATED).send({ id: userId })
}

const getUserById = async (request: FastifyRequest, response: FastifyReply) => {
    const params = userParamsSchema.parse(request.params)

    const user = await usersRepository.findById(params.userId)

    return response.status(StatusCodes.OK).send({ data: user })
}

const deleteUserById = async (request: FastifyRequest, response: FastifyReply) => {
    const params = userParamsSchema.parse(request.params)

    await usersRepository.delete(params.userId)

    return response.status(StatusCodes.NO_CONTENT).send()
}

const updateUser = async (request: FastifyRequest, response: FastifyReply) => {
    const body = updateUserBodySchema.parse(request.body)
    const params = userParamsSchema.parse(request.params)

    const updatedUserProperties = Object.fromEntries(
        Object.entries({
            email: body?.email ?? undefined,
            password: body?.email ?? undefined,
            username: body?.email ?? undefined,
        } as UserModel).filter(([, value]) => value !== undefined)
    )

    try {
        await usersRepository.update(params.userId, updatedUserProperties)
        return response.status(StatusCodes.NO_CONTENT).send()
    } catch (err) {
        if (err instanceof Error) {
            return response.status(StatusCodes.CONFLICT).send({
                error: {
                    message: `Erro ao atualizar usuário: ${err.message}`,
                    scope: updateUser.name.toString(),
                },
            })
        }
    }
}

const usersServices = {
    checkUserExistsById,
    checkUserExistsByProperties,
    getUserById,
    createUser,
    updateUser,
    deleteUserById,
}

export default usersServices
