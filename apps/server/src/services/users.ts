import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"

import { hashPassword } from "@/lib/crypto.ts"
import { UserModel } from "@/models/users.ts"
import tasksRepository from "@/repositories/tasks.ts"
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
    const body = createUserBodySchema.partial().required({ email: true }).safeParse(request.body)

    if (body.success === false) {
        return response.code(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "Invalid body",
                scope,
            },
        })
    }

    if ((await usersRepository.count({ email: (value: string) => value === body.data.email })) === 0) {
        return response.code(StatusCodes.NOT_FOUND).send({
            error: {
                message: "Usuário não encontrado",
                scope,
            },
        })
    }
}

const createUser = async (request: FastifyRequest, response: FastifyReply) => {
    const body = createUserBodySchema.parse(request.body)

    const { salt, hash } = hashPassword(body.password)

    const userId = await usersRepository.create({
        email: body.email,
        username: body.username,
        salt: salt,
        hash: hash,
    })

    return response.status(StatusCodes.CREATED).send({ id: userId })
}

const getUserById = async (request: FastifyRequest, response: FastifyReply) => {
    const params = userParamsSchema.parse(request.params)

    const user = await usersRepository.findById(params.userId)

    // TODO: Exclude properties that should not be shown as "hash" and "salt"
    return response.status(StatusCodes.OK).send({ data: user })
}

const deleteUserById = async (request: FastifyRequest, response: FastifyReply) => {
    const params = userParamsSchema.parse(request.params)

    await usersRepository.delete(params.userId)
    await tasksRepository.deleteMany({
        userId: (value: string) => value === params.userId,
    })

    return response.status(StatusCodes.NO_CONTENT).send()
}

const updateUser = async (request: FastifyRequest, response: FastifyReply) => {
    const body = updateUserBodySchema.parse(request.body)
    const params = userParamsSchema.parse(request.params)

    const updatedUserProperties = Object.fromEntries(
        Object.entries({
            username: body?.username ?? undefined,
            email: body?.email ?? undefined,
        } as Partial<UserModel>).filter(([, value]) => value !== undefined)
    )

    for (const property in updatedUserProperties) {
        if ((await usersRepository.count({ [property]: (value: string) => value === updatedUserProperties[property] })) !== 0) {
            return response.status(StatusCodes.CONFLICT).send({
                error: {
                    message: "Could not update user, property already exists",
                    scope: updateUser.name.toString(),
                },
            })
        }
    }

    try {
        await usersRepository.update(params.userId, updatedUserProperties)
        return response.status(StatusCodes.NO_CONTENT).send()
    } catch (err) {
        if (err instanceof Error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: {
                    message: `Erro ao atualizar usuário: ${err.message}`,
                    scope: updateUser.name.toString(),
                },
            })
        }
    }
}

const getAllUser = async (_: FastifyRequest, response: FastifyReply) => {
    const users = await usersRepository.findAll()
    return response.status(StatusCodes.OK).send({ data: users })
}

const usersServices = {
    checkUserExistsById,
    checkUserExistsByProperties,
    getUserById,
    createUser,
    updateUser,
    deleteUserById,
    getAllUser,
}

export default usersServices
