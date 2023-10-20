import { tasks } from "../lib/database/models/tasks.js"

const idDaTarefa = tasks.insert({
    title: "",
    description: "",
    startAt: new Date("2023-10-19").toISOString(),
    dueDate: new Date("2023-10-19").toISOString(),
    isCompleted: "false",
    userId: "cfbb0e9e-a61e-43af-a162-b45dd29a7ec3",
})


console.log(idDaTarefa)

const tarefa = tasks.get(idDaTarefa)
console.log(tarefa)