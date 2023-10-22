import { ENV } from "@/lib/env.ts"
import { server } from "@/server.ts"

server.listen(
    {
        port: ENV.PORT ?? 3333,
        host: ENV.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
    },
    (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }

        console.info(`server listening on ${address}`)
    }
)
