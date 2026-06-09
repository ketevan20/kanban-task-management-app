const express = require("express")
const connectToDB = require("./config/connectToDB")

const boardRoutes = require("./routes/boards")
const columnRoutes = require("./routes/columns")
const taskRoutes = require("./routes/tasks")
const subtaskRoutes = require("./routes/subtasks")

const app = express()
app.use(express.json())

connectToDB()

app.use("/boards", boardRoutes)
app.use("/columns", columnRoutes)
app.use("/tasks", taskRoutes)
app.use("/subtasks", subtaskRoutes)

app.listen(3001, () => console.log("server running on port 3001"))
