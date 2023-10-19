import { InMemoryTable, InMemoryTableModel } from "../in-memory-table.ts"
import { ValidatorFunction, Validators } from "../validators/validators.ts"

export interface UserModel extends Partial<InMemoryTableModel> {
    username: string
    email: string
    password: string
}

const MIN_USERNAME_LENGTH = 5
const MAX_USERNAME_LENGTH = 20

const UserValidators = Object.freeze({
    isPassword: (value: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/.test(value),
    isValidUsername: (value: string): boolean => value.length >= MIN_USERNAME_LENGTH && value.length <= MAX_USERNAME_LENGTH && /^[a-zA-Z0-9]+$/.test(value),
}) satisfies Readonly<Record<string, ValidatorFunction>>

export const users = new InMemoryTable<UserModel>("users", {
    columns: [
        ["username", { validators: [Validators.isValidName, UserValidators.isValidUsername] }],
        ["email", { validators: [Validators.isEmail] }],
        ["password", { validators: [UserValidators.isPassword] }],
    ],
})