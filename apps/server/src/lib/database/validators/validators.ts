import { DateTimeString } from "../in-memory-table.ts"

export type ValidatorFunction = (value: string) => boolean

export const Validators = Object.freeze({
    isValidName: (name: string): boolean => name.length >= 1 && name.length <= 100,
    isUUID: (id: string): boolean => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id),
    isEmail: (email: string): boolean => /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i.test(email),
    isDateTimeString: (date: string | DateTimeString): boolean => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(date),
    isBoolean: (value: string | boolean): boolean => value === "true" || value === "false" || value === false || value === true,
    isNumber: (value: string | number): boolean => /^-?\d+$/.test(value.toString(10)),
    isArray: (value: string): boolean => Array.isArray(JSON.parse(value)),
}) satisfies Readonly<Record<string, ValidatorFunction>>