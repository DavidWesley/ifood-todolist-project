import { fastifyCors } from "@fastify/cors"
import { fastifyRateLimit } from "@fastify/rate-limit"
import Fastify from "fastify"

import { ENV } from "@/lib/env.ts"
import { logger } from "@/lib/logger.ts"
import { StatusCodes } from "http-status-codes"

export const server = Fastify({
    logger: logger[ENV.NODE_ENV] ?? false,
    requestTimeout: 40 * 1_000, // 40 seconds
    caseSensitive: true,
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    forceCloseConnections: "idle",
})

server.register(fastifyCors, {
    origin: "*",
})

server.register(fastifyRateLimit, {
    global: true,
    max: 10,
    ban: 3,
    timeWindow: 5 * 1_000, // 5 seconds
    continueExceeding: false,
})

server.get("/check", async (_, res) => {
    return res.status(StatusCodes.OK).send()
})
