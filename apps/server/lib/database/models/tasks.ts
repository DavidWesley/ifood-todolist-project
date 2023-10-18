import { DateTimeString, InMemoryTable, InMemoryTableModel } from "../in-memory-table"
import { Validators } from "../validators/validators"
import { UserModel } from "./users"

interface TaskModel extends Partial<InMemoryTableModel> {
    title: string
    description: string
    startAt: DateTimeString
    dueDate: DateTimeString
    isCompleted: boolean
    userId: Required<UserModel["id"]>
}

export const tasks = new InMemoryTable<TaskModel>("tasks", {
    columns: [
        ["title", { defaultValue: () => "" }],
        ["description", { defaultValue: () => "" }],
        ["startAt", { validators: [Validators.isDateTimeString], defaultValue: () => new Date().toISOString() }],
        ["dueDate", { validators: [Validators.isDateTimeString] }],
        ["isCompleted", { validators: [Validators.isBoolean], defaultValue: () => "false" }],
        ["userId", { validators: [Validators.isUUID] }],
    ],
})
