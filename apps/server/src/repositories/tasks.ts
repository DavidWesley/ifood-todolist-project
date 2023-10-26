import { database } from "@/lib/database/database.ts"
import { DateTimeString, InMemoryModelQuery, InMemoryTableModel, UUID } from "@/lib/database/in-memory-table.ts"
import { TaskModel } from "@/models/tasks.ts"
import { Repository } from "@/repositories/default.ts"

interface TaskRepository<M> extends Repository<M> {
    findManyByUserId(userId: UUID): Promise<M[]>
}

export class TasksRepository implements TaskRepository<TaskModel> {
    private static convertRawIntoLiteralObject(raw: Map<keyof TaskModel, string>): TaskModel {
        const task = {
            id: raw.get("id")! as UUID,
            createdAt: raw.get("createdAt")! as DateTimeString,
            updatedAt: raw.get("updatedAt")! as DateTimeString,

            title: raw.get("title")!,
            description: raw.get("description")!,

            startAt: raw.get("startAt")! as DateTimeString,
            dueDate: raw.get("dueDate")! as DateTimeString,
            isCompleted: raw.get("isCompleted")! === "true" ? true : false,

            userId: raw.get("userId")! as UUID,
        } satisfies TaskModel

        return task
    }

    private static copyNonNullChangeableProperties(data: Partial<Omit<TaskModel, "userId">>): Partial<Record<keyof TaskModel, string>> {
        const partialTaskProperties = Object.fromEntries(
            Object.entries({
                title: data?.title ?? undefined,
                description: data?.description ?? undefined,
                startAt: data?.startAt ?? undefined,
                dueDate: data?.dueDate ?? undefined,
                isCompleted: data?.isCompleted ?? undefined,
            } as Partial<TaskModel>).filter(([, value]) => value !== undefined)
        )

        return partialTaskProperties
    }

    async findManyByUserId(userId: UUID): Promise<TaskModel[]> {
        return await database.tasks
            .select({
                filters: {
                    userId: (id: string) => id === userId,
                },
            })
            .map((taskRaw) => TasksRepository.convertRawIntoLiteralObject(taskRaw))
    }

    async create(data: Omit<TaskModel, keyof InMemoryTableModel>): Promise<UUID> {
        const now = new Date().toISOString()

        const taskId = await database.tasks.insert({
            title: data.title ?? "",
            description: data.description ?? "",
            isCompleted: String(data.isCompleted) === "true" ? "true" : "false",
            startAt: data.startAt ?? now,
            dueDate: data.dueDate,
            userId: data.userId!,
        })

        return taskId
    }

    async findAll(): Promise<TaskModel[]> {
        return await database.tasks.getAll().map((taskRaw) => TasksRepository.convertRawIntoLiteralObject(taskRaw))
    }

    async findById(id: UUID): Promise<TaskModel | null> {
        const taskRaw = await database.tasks.get(id)

        if (taskRaw === undefined) return null

        return TasksRepository.convertRawIntoLiteralObject(taskRaw)
    }

    async findOne(filters: InMemoryModelQuery<TaskModel>["filters"]): Promise<TaskModel | null> {
        const taskRaw = await database.tasks.select({ filters: filters! }).at(0)

        if (taskRaw === undefined) return null

        return TasksRepository.convertRawIntoLiteralObject(taskRaw)
    }

    async update(id: UUID, data: Partial<TaskModel>): Promise<void> {
        await database.tasks.update(id, TasksRepository.copyNonNullChangeableProperties(data))
    }

    async updateMany(filters: InMemoryModelQuery<TaskModel>["filters"] | undefined, data: Partial<TaskModel>): Promise<number> {
        const selectedTasks = await database.tasks.select({
            columns: ["id"],
            filters: filters!,
        })

        for (const taskRaw of selectedTasks) {
            await this.update(taskRaw.get("id")! as UUID, data)
        }

        return selectedTasks.length
    }

    async delete(id: UUID): Promise<boolean> {
        try {
            await database.tasks.delete(id)
            return true
        } catch {
            return false
        }
    }

    async deleteMany(filters: InMemoryModelQuery<TaskModel>["filters"]): Promise<number> {
        let counter = 0
        const selectedTasks = await database.tasks.select({
            columns: ["id"],
            filters: filters!,
        })

        for (const taskRaw of selectedTasks) {
            if ((await this.delete(taskRaw.get("id")! as UUID)) === true) counter += 1
        }

        return counter
    }

    async count(filters: InMemoryModelQuery<TaskModel>["filters"] | undefined): Promise<number> {
        const selectedTasks = await database.tasks.select({
            columns: ["id"],
            filters: filters!,
        })

        return selectedTasks.length
    }
}

const tasksRepository = new TasksRepository()

export default tasksRepository
