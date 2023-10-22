import "dotenv/config"

import { z } from "zod"

const envSchema = z.object({
    PORT: z.coerce.number().positive().min(80).max(65_000),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

export const ENV = envSchema.parse(process.env)
