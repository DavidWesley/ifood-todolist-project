import * as crypto from "crypto"

type HashedPassword = { salt: string; hash: string }

/**
 * Generates a random salt.
 *
 * @returns {string} - The generated salt.
 */
function generateSalt(): string {
    return crypto.randomBytes(16).toString("hex")
}

/**
 * Hashes a password using the provided salt and returns the hash.
 *
 * @param {string} password - The password to be hashed.
 * @param {string} salt - The salt to be used for hashing.
 * @returns {string} - The hashed password.
 */
function createPbkdf2SyncHashWithSalt(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
}

/**
 * Hashes a password using a random salt and returns the salt and hash values.
 *
 * @param {string} password - The password to be hashed.
 * @return {HashedPassword} - An object containing the salt and hash values.
 */
export function hashPassword(password: string): HashedPassword {
    const salt = generateSalt()
    const hash = createPbkdf2SyncHashWithSalt(password, salt)
    return { salt, hash }
}

/**
 * Verifies if the provided password matches the stored password data.
 *
 * @param {string} providedPassword - The password provided by the user.
 * @param {HashedPassword} storedPasswordData - An object containing the salt and hash of the stored password.
 * @returns {boolean} Returns true if the provided password matches the stored password, otherwise false.
 */
export function verifyPassword(providedPassword: string, storedPasswordData: HashedPassword): boolean {
    const { salt, hash } = storedPasswordData
    const verifyHash = createPbkdf2SyncHashWithSalt(providedPassword, salt)
    return verifyHash === hash
}
