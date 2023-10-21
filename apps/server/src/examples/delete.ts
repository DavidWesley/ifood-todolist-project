import { database } from "@/lib/database/database.ts"

const insertedTaskID_1 = database.tasks.insert({
    title: "Test 1",
    description: "Test 2",
    startAt: new Date("2023-10-19").toISOString(),
    dueDate: new Date("2023-10-20").toISOString(),
    isCompleted: "false",
    userId: "cfbb0e9e-a61e-43af-a162-b45dd29a7ec3",
})

const insertedTaskID_2 = database.tasks.insert({
    title: "Test 2",
    description: "Test 2",
    startAt: new Date("2023-10-20").toISOString(),
    dueDate: new Date("2023-10-21").toISOString(),
    isCompleted: "true",
    userId: "cfbb0e9e-a61e-43af-a162-b45dd29a7ec3",
})

console.log("TASK_ID_1:", insertedTaskID_1)
console.log("TASK_ID_2:", insertedTaskID_2)
console.log(
    "ALL TASKS BEFORE DELETE:\n",
    database.tasks.getAll().map((task) => Object.fromEntries(task))
)

// Deletando a primeira tarefa
database.tasks.delete(insertedTaskID_1)

console.log(
    "ALL TASKS AFTER DELETE:\n",
    database.tasks
        .getAll()
        .map((task) => Object.fromEntries(task))
)
