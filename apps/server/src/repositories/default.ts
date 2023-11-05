import { InMemoryModelQuery, UUID } from "@/libs/in-memory-table.ts"

export interface Repository<M> {
    create(data: M): Promise<UUID | undefined>
    findAll(): Promise<M[]>
    findById(id: UUID): Promise<M | null>
    findOne(filters: InMemoryModelQuery<M>["filters"]): Promise<M | null>
    update(id: UUID, data: Partial<M>): Promise<void>
    updateMany(filters: InMemoryModelQuery<M>["filters"], data: Partial<M>): Promise<number>
    delete(id: UUID): Promise<boolean>
    deleteMany(filters: InMemoryModelQuery<M>["filters"]): Promise<number>
    count(filters: InMemoryModelQuery<M>["filters"]): Promise<number>
}
