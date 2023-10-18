import type { UUID } from "node:crypto"
import { randomUUID } from "node:crypto"

export type { UUID }
export type DateTimeString = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`

export interface InMemoryTableModel {
    id: UUID
    createdAt: DateTimeString
    updatedAt: DateTimeString
}

interface InMemoryTableConfig<K> {
    columns: Array<[name: K, options: InMemoryTableColumnOptions]>
}

interface InMemoryTableColumnOptions {
    validators?: Array<(value: string) => boolean>
    defaultValue?: () => string
}

interface InMemoryModelQuery<K> {
    filters?: Partial<Record<keyof K, InMemoryModelQueryFilter>>
    columns?: Array<keyof K>
}

interface InMemoryModelQueryFilter {
    (value: string): boolean
}

export class InMemoryTable<T extends Partial<InMemoryTableModel>, U = keyof Omit<T, keyof InMemoryTableModel>> {
    private table = new Map<UUID, Map<keyof T, string>>()

    /**
     * Initializes a new instance of the class.
     *
     * @param {string} tableName - The name of the table.
     * @param {InMemoryTableConfig<U>} config - The configuration for the in-memory table.
     */
    constructor(
        private readonly tableName: string,
        private config: InMemoryTableConfig<U>
    ) { }

    /**
     * Inserts a new record into the table.
     *
     * @param {Record<U, string>} data - The data to be inserted into the table.
     * @return {UUID} - The generated UUID for the inserted record.
     */
    insert(data: Record<U, string>): UUID {
        const id = randomUUID()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()

        const row = new Map<keyof T, string>()

        for (const [name, options] of this.config.columns) {
            if (Reflect.has(data, String(name))) {
                const value = Reflect.get(data, String(name))
                if (options.validators?.every((validator) => validator(value))) row.set(name as keyof T, value)
                else throw new TypeError(`Invalid value for column ${name}: ${value}`)
            } else if (options.defaultValue) {
                row.set(name as keyof T, options.defaultValue())
            } else {
                throw new Error(`Missing value for column ${name}`)
            }
        }

        row
            .set("id", id)
            .set("createdAt", createdAt)
            .set("updatedAt", updatedAt)

        this.table.set(id, row)

        return id
    }

    /**
     * Selects rows from the table that match the given query.
     *
     * @param {InMemoryModelQuery<T>} query - The query object used to filter the rows.
     * @return {Array<Map<keyof T, string>>} - An array of maps representing the rows that match the query.
     */
    select(query: InMemoryModelQuery<T>): Array<Map<keyof T, string>> {
        const results: Map<keyof T, string>[] = []

        this.table.forEach((row) => {
            let isValid = true
            for (const [columnName, value] of row) {
                const condition = query?.filters?.[columnName] ?? ((value: string) => Boolean(value))

                if (condition(value) === false) {
                    isValid = false
                    break
                }
            }

            if (isValid) results.push(row)
        })

        if (query.columns?.length) {
            return results.map((row) => {
                const formattedRow = new Map<keyof T, string>()

                for (const name of query.columns ?? []) {
                    if (row.has(name)) formattedRow.set(name, row.get(name)!)
                }

                return formattedRow
            })
        }

        return results
    }

    /**
     * Updates a row in the table with the specified ID using the provided data.
     *
     * @param {UUID} id - The ID of the row to update.
     * @param {Record<U, string>} data - The data to update the row with.
     * @throws {Error} If the row with the specified ID is not found.
     * @throws {TypeError} If any of the values in the data are invalid for their respective columns.
     * @return {void}
     */
    update(id: UUID, data: Record<U, string>): void {
        const row = this.table.get(id)
        if (!row) throw new Error(`Row ${id} not found`)

        for (const [name, options] of this.config.columns) {
            if (Reflect.has(data, String(name))) {
                const value = Reflect.get(data, String(name))
                if (options.validators?.every((validator) => validator(value))) row.set(name as keyof T, value)
                else throw new TypeError(`Invalid value for column ${name}: ${value}`)
            }
        }

        row.set("updatedAt", new Date().toISOString())
    }

    /**
     * Deletes an item from the table based on the provided ID.
     *
     * @param {UUID} id - The ID of the item to delete.
     * @return {void}
     */
    delete(id: UUID): void {
        this.table.delete(id)
    }

    /**
     * Retrieves a map of properties for the given ID.
     *
     * @param {UUID} id - The ID of the object to retrieve.
     * @return {Map<keyof T, string> | undefined} - The map of properties for the given ID, or undefined if the ID does not exist.
     */
    get(id: UUID): Map<keyof T, string> | undefined {
        return this.table.get(id)
    }

    /**
     * Returns an array of maps containing the values of the table.
     *
     * @return {Array<Map<keyof T, string>>} An array of maps representing the table values.
     */
    getAll(): Array<Map<keyof T, string>> {
        return Array.from(this.table.values())
    }

    /**
     * Returns the table name.
     *
     * @return {string} The table name.
     */
    getTableName(): string {
        return this.tableName
    }

    /**
     * Retrieves the names of the columns.
     *
     * @return {Array<U>} An array of column names.
     */
    getColumnsNames(): Array<U> {
        return this.config.columns.map(([name]) => name)
    }
}
