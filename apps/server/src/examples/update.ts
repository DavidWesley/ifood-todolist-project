import { tasks } from "../lib/database/models/tasks.ts"


const id = tasks.insert({
    title: "Test",
    description: "Test",
    startAt: new Date().toISOString(),
    dueDate: new Date("2023-11-01").toISOString(),
    isCompleted: "false",
    "userId": "cfbb0e9e-a61e-43af-a162-b45dd29a7ec3"
})

console.log(Object.fromEntries(tasks.get(id)))

const editaTarefa = tasks.update(id,{
    isCompleted: "false",
})

console.log(editaTarefa)
const tarefaEditada = tasks.get(id)

console.log(Object.fromEntries(tarefaEditada))