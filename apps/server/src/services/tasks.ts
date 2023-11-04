import { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"

import { createTaskBodySchema, taskAndUserParamsSchema, taskParamsSchema, updateTaskBodySchema, userParamsSchema } from "@/schemas/zod.ts"

import tasksRepository from "@/repositories/tasks.ts"

//// HOOKS ////
const checkTaskExists = async (request: FastifyRequest, response: FastifyReply) => {
    const scope = checkTaskExists.name.toString()
    const params = taskParamsSchema.safeParse(request.params)

    if (params.success === false) {
        response.code(StatusCodes.BAD_REQUEST).send({
            error: {
                message: "Invalid params",
                scope,
            },
        })
    } else if ((await tasksRepository.findById(params.data.taskId)) === null) {
        response.code(StatusCodes.NOT_FOUND).send({
            error: {
                message: "Tarefa não encontrada",
                scope,
            },
        })
    }
}

//// HANDLERS ////
const getAllUserTasks = async (request: FastifyRequest, response: FastifyReply) => {
    const scope = getAllUserTasks.name.toString()
    const params = userParamsSchema.parse(request.params)

    try {
        const userTasks = await tasksRepository.findManyByUserId(params.userId)
        return response.status(StatusCodes.OK).send({ data: userTasks })
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                message: "Erro ao buscar tarefas do usuário",
                scope,
            },
        })
    }
}

const getTaskById = async (request: FastifyRequest, response: FastifyReply) => {
    const params = taskAndUserParamsSchema.parse(request.params)

    try {
        const task = await tasksRepository.findById(params.taskId)
        return response.status(StatusCodes.OK).send({ data: task })
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: {
                message: "Erro ao buscar tarefa",
                scope: getTaskById.name.toString(),
            },
        })
    }
}

const createTask = async (request: FastifyRequest, response: FastifyReply) => {
    const body = createTaskBodySchema.parse(request.body)
    const params = userParamsSchema.parse(request.params)

    const taskId = await tasksRepository.create({
        title: body.title ?? "",
        description: body.description ?? "",
        startAt: body.startAt ?? new Date().toISOString(),
        dueDate: body.dueDate,
        isCompleted: body.isCompleted ?? false,
        userId: params.userId,
    })

    return response.status(StatusCodes.CREATED).send({ id: taskId })
}

const deleteTaskById = async (request: FastifyRequest, response: FastifyReply) => {
    const params = taskAndUserParamsSchema.parse(request.params)

    await tasksRepository.delete(params.taskId)

    return response.status(StatusCodes.NO_CONTENT).send()
}

const updateTask = async (request: FastifyRequest, response: FastifyReply) => {
    const body = updateTaskBodySchema.parse(request.body)
    const params = taskAndUserParamsSchema.parse(request.params)

    const updatedTaskProperties = Object.fromEntries(
        Object.entries({
            title: body?.title ?? undefined,
            description: body?.description ?? undefined,
            startAt: body?.startAt ?? undefined,
            dueDate: body?.dueDate ?? undefined,
            isCompleted: body?.isCompleted ?? undefined,
        }).filter(([, value]) => value !== undefined)
    )

    await tasksRepository.update(params.taskId, updatedTaskProperties)

    return response.status(StatusCodes.NO_CONTENT).send()
}

const tasksServices = {
    checkTaskExists,
    getAllUserTasks,
    createTask,
    updateTask,
    deleteTaskById,
    getTaskById,
}

export default tasksServices
