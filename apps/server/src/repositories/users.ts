import { database } from "@/lib/database/database.ts"
import { DateTimeString, InMemoryModelQuery, InMemoryTableModel, UUID } from "@/lib/database/in-memory-table.ts"
import { UserModel } from "@/models/users.ts"
import { Repository } from "@/repositories/default.ts"

interface UserRepository<M> extends Repository<M> {
    exists(id: UUID): Promise<boolean>
}

export class UsersRepository implements UserRepository<UserModel> {
    private static convertRawIntoLiteralObject(raw: Map<keyof UserModel, string>): UserModel {
        const user = {
            id: raw.get("id")! as UUID,
            createdAt: raw.get("createdAt")! as DateTimeString,
            updatedAt: raw.get("updatedAt")! as DateTimeString,

            email: raw.get("email")!,
            username: raw.get("username")!,
            password: raw.get("password")!,
        } satisfies UserModel

        return user
    }

    private static copyNonNullChangeableProperties(data: Partial<UserModel>): Partial<Record<keyof UserModel, string>> {
        const partialUserProperties = Object.fromEntries(
            Object.entries({
                email: data?.email ?? undefined,
                username: data?.username ?? undefined,
                password: data?.password ?? undefined,
            } as Partial<UserModel>).filter(([, value]) => value !== undefined)
        )

        return partialUserProperties
    }

    async exists(id: UUID): Promise<boolean> {
        return (await database.users.get(id)) !== undefined
    }

    async create(data: Omit<UserModel, keyof InMemoryTableModel>): Promise<UUID> {
        const id = await database.users.insert({
            username: data.username,
            email: data.email,
            password: data.password,
        })

        return id
    }

    async findAll(): Promise<UserModel[]> {
        return await database.users.getAll().map((userRaw) => UsersRepository.convertRawIntoLiteralObject(userRaw))
    }

    async findById(id: UUID): Promise<UserModel | null> {
        const userRaw = await database.users.get(id)

        if (userRaw === undefined) return null

        return UsersRepository.convertRawIntoLiteralObject(userRaw)
    }

    async findOne(filters: InMemoryModelQuery<UserModel>["filters"] | undefined): Promise<UserModel | null> {
        const userRaw = await database.users.select({ filters: filters! }).at(0)

        if (userRaw === undefined) return null

        return UsersRepository.convertRawIntoLiteralObject(userRaw)
    }

    async update(id: UUID, data: Partial<UserModel>): Promise<void> {
        const userRaw = await database.users.get(id)
        if (userRaw === undefined) throw new Error("User not found")

        const userChangeableProperties = UsersRepository.copyNonNullChangeableProperties(data)

        for (const key of userRaw.keys()) {
            if (key === "password") continue
            if (Reflect.has(userChangeableProperties, key)) {
                const isAlreadyExistsUserWithSameValue = await this.count({
                    [key]: (value: string) => value === userRaw.get(key),
                })

                if (isAlreadyExistsUserWithSameValue) throw new Error("User with same value already exists")
            }
        }

        await database.users.update(id, UsersRepository.copyNonNullChangeableProperties(data))
    }

    async updateMany(filters: InMemoryModelQuery<UserModel>["filters"] | undefined, data: Partial<UserModel>): Promise<number> {
        const selectedUsers = await database.users.select({
            columns: ["id"],
            filters: filters!,
        })

        for (const userRaw of selectedUsers) {
            await this.update(userRaw.get("id")! as UUID, data)
        }

        return selectedUsers.length
    }

    async delete(id: UUID): Promise<boolean> {
        try {
            await database.users.delete(id)
            return true
        } catch {
            return false
        }
    }

    async deleteMany(filters: InMemoryModelQuery<UserModel>["filters"] | undefined): Promise<number> {
        let counter = 0
        const selectedUsers = await database.users.select({
            columns: ["id"],
            filters: filters!,
        })

        for (const userRaw of selectedUsers) {
            if ((await this.delete(userRaw.get("id")! as UUID)) === true) counter += 1
        }

        return counter
    }

    async count(filters: InMemoryModelQuery<UserModel>["filters"] | undefined): Promise<number> {
        const selectedUsers = await database.users.select({
            columns: ["id"],
            filters: filters!,
        })

        return selectedUsers.length
    }
}

const usersRepository = new UsersRepository()

export default usersRepository