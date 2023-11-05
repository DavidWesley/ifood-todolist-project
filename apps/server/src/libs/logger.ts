import { ENV } from "@/libs/env.ts"
import { FastifyServerOptions } from "fastify"

export const logger: Record<(typeof ENV)["NODE_ENV"], FastifyServerOptions["logger"]> = {
    development: {
        level: "debug",
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    },
    production: {
        level: "error",
    },
    test: false,
}
