import { ENV } from "@/libs/env.ts"
import jwt from "jsonwebtoken"

export function generateAccessToken(payload: jwt.JwtPayload, options?: jwt.SignOptions): string {
    return jwt.sign(payload, ENV["ACCESS_TOKEN_SECRET"], {
        ...options,
        expiresIn: options?.expiresIn ?? "1h",
    })
}

export function verifyAccessToken<P extends Record<string, string> = Record<string, string>>(
    token: string
): jwt.JwtPayload & { [K in keyof P]: string } {
    return jwt.verify(token, ENV["ACCESS_TOKEN_SECRET"]) as jwt.JwtPayload & { [K in keyof P]: string }
}
