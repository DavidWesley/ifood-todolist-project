import { API_BASE_URL } from "@/libs/env"
import axios from "axios"

export function getAPIClient() {
    const api = axios.create({
        baseURL: API_BASE_URL,
    })

    // TODO: Remove this
    api.interceptors.request.use((config) => {
        console.log(config)
        return config
    })

    return api
}
