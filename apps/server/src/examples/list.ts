import { tasks } from "../lib/database/models/tasks.js"

const id = tasks.insert({
    title: "Test",
    description: "Test",
    startAt: new Date("2023-10-19").toISOString(),
    dueDate: new Date("2023-10-19").toISOString(),
    isCompleted: "false",
    userId: "cfbb0e9e-a61e-43af-a162-b45dd29a7ec3",
})

const listarTarefa = tasks.getAll()

const listarUmaTarefa = tasks.get(id)

console.log(listarTarefa)
console.log(listarUmaTarefa)