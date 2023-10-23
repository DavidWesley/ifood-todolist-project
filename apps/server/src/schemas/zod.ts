import { DateTimeString, InMemoryTableModel } from "@/lib/database/in-memory-table.ts"
import { Validators } from "@/lib/database/validators/validators.ts"
import { TaskModel } from "@/models/tasks.ts"
import { z } from "zod"

//// COMMONS ////
export const dateTimeStringSchema = z.string({ coerce: true }).datetime() as z.ZodType<DateTimeString>
export const uuidSchema = z.coerce.string({ coerce: true }).uuid().refine(Validators.isUUID)

//// TASKS SCHEMAS ////
export type ChangeableTaskProperties = Omit<TaskModel, "userId" | keyof InMemoryTableModel>

export type ChangeableTaskPropertiesObjectType = {
    [key in keyof ChangeableTaskProperties]: z.ZodType<ChangeableTaskProperties[key]>
}

export const taskParamsSchema = z.object({
    taskId: uuidSchema,
})

export const changeableTaskBodySchema = z.object<ChangeableTaskPropertiesObjectType>({
    title: z.string(),
    description: z.string(),
    dueDate: dateTimeStringSchema,
    startAt: dateTimeStringSchema,
    isCompleted: z.boolean(),
})

export const createTaskBodySchema = changeableTaskBodySchema.partial({
    title: true,
    description: true,
    isCompleted: true,
})

export const updateTaskBodySchema = changeableTaskBodySchema.partial({
    title: true,
    description: true,
    startAt: true,
    dueDate: true,
    isCompleted: true,
})

//// USERS SCHEMAS ////
export const userParamsSchema = z.object({
    userId: uuidSchema,
})

export const createUserBodySchema = z.object({
    email: z.string().email(),
    username: z.string().min(5).max(20),
    password: z.string().min(8).max(32),
})

export const updateUserBodySchema = createUserBodySchema.partial({
    email: true,
    username: true,
    password: true,
})

//// MIXED SCHEMAS ////
export const taskAndUserParamsSchema = userParamsSchema.merge(taskParamsSchema)
