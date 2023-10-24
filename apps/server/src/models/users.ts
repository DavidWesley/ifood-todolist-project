import { InMemoryTable, InMemoryTableModel } from "@/lib/database/in-memory-table.ts"
import { ValidatorFunction, Validators } from "@/lib/database/validators/validators.ts"

export interface UserModel extends Partial<InMemoryTableModel> {
    username: string
    email: string
    salt: string
    hash: string
}

const MIN_USERNAME_LENGTH = 5
const MAX_USERNAME_LENGTH = 20
const SALT_LENGTH = 32
const HASH_LENGTH = 128

const UserValidators = Object.freeze({
    isPassword: (value: string): boolean => /^[a-zA-Z\d]{8,32}$/.test(value),
    isValidUsername: (value: string): boolean => {
        return value.length >= MIN_USERNAME_LENGTH && value.length <= MAX_USERNAME_LENGTH && /^[a-zA-Z0-9]+$/.test(value)
    },
    isValidSalt: (value: string): boolean => value.length === SALT_LENGTH,
    isValidHash: (value: string): boolean => value.length === HASH_LENGTH,
}) satisfies Readonly<Record<string, ValidatorFunction>>

export const users = new InMemoryTable<UserModel>("users", {
    columns: [
        ["username", { validators: [Validators.isValidName, UserValidators.isValidUsername], unique: true }],
        ["email", { validators: [Validators.isEmail], unique: true }],
        ["salt", { validators: [UserValidators.isValidSalt] }],
        ["hash", { validators: [UserValidators.isValidHash] }],
    ],
})
