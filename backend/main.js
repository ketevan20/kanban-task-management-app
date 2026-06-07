const express = require('express')
const connectToDB = require('./config/connectToDB')
const boards = require('./schema/boards')
const { isValidObjectId } = require("mongoose")

const app = express()
app.use(express.json())

connectToDB()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/boards', async (req, res) => {
    let findAllBoards = await boards.find()
    res.send(findAllBoards)
})

app.get('/boards/:id', async (req, res) => {
    let { id } = req.params
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "invalid mongo id" })
    }
    let findById = await boards.findById(id)
    res.send(findById)
})

app.post('/boards', async (req, res) => {
    let { name, columns } = req.body
    if (!name) {
        return res.status(400).json({ message: "name is a required field" })
    }
    let newBoard = await boards.create({ name, columns })
    res.send(newBoard)
})

app.delete('/boards/:id', async (req, res) => {
    let { id } = req.params
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "invalid mongo id" })
    }
    let deleteBoard = await boards.findByIdAndDelete(id)
    res.send(deleteBoard)
})

app.put('/boards/:id', async (req, res) => {
    let { id } = req.params
    let { name, columns } = req.body
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "invalid mongo id" })
    }

    let updateData = {}

    if (name !== undefined) updateData.name = name
    if (columns !== undefined) updateData.columns = columns

    let updateBoard = await boards.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    )

    res.send(updateBoard)
})

app.post("/boards/:boardId/columns/:columnId/tasks", async (req, res) => {
    const { boardId, columnId } = req.params
    const { title, description, subtasks } = req.body

    if (!title) {
        return res.status(400).json({ message: "title" })
    }

    const board = await boards.findById(boardId)

    if (!board) {
        return res.status(404).json({
            message: "board not found"
        })
    }

    const column = board.columns.id(columnId)

    if (!column) {
        return res.status(404).json({
            message: "column not found"
        })
    }

    column.tasks.push({
        title,
        description,
        subtasks: subtasks || []
    })

    await board.save()

    res.json(board)
})

app.put("/boards/:boardId/columns/:columnId/tasks/:taskId", async (req, res) => {
    const { boardId, columnId, taskId } = req.params
    const { title, description, subtasks } = req.body

    const board = await boards.findById(boardId)

    if (!board) {
        return res.status(404).json({
            message: "board not found"
        })
    }

    const column = board.columns.id(columnId)

    if (!column) {
        return res.status(404).json({
            message: "column not found"
        })
    }

    const task = column.tasks.id(taskId)

    if (!task) {
        return res.status(404).json({
            message: "task not found"
        })
    }

    if (title !== undefined) {
        task.title = title
    }

    if (description !== undefined) {
        task.description = description
    }

    if (subtasks !== undefined) {
        task.subtasks = subtasks
    }

    await board.save()

    res.json(task)
})

app.delete("/boards/:boardId/columns/:columnId/tasks/:taskId",
    async (req, res) => {
        const { boardId, columnId, taskId } = req.params

        const board = await boards.findById(boardId)

        if (!board) {
            return res.status(404).json({
                message: "board not found"
            })
        }

        const column = board.columns.id(columnId)

        if (!column) {
            return res.status(404).json({
                message: "column not found"
            })
        }

        const task = column.tasks.id(taskId)

        if (!task) {
            return res.status(404).json({
                message: "task not found"
            })
        }

        column.tasks.pull(taskId)

        await board.save()

        res.json({
            message: "task deleted"
        })
    }
)

app.patch("/boards/:boardId/tasks/:taskId/move", async (req, res) => {
    try {
        const { boardId, taskId } = req.params;

        const {
            sourceColumnId,
            destinationColumnId,
            destinationIndex
        } = req.body;

        const board = await boards.findById(boardId);

        if (!board) {
            return res.status(404).json({ message: "board not found" });
        }

        const sourceColumn = board.columns.id(sourceColumnId);
        const destinationColumn = board.columns.id(destinationColumnId);

        if (!sourceColumn || !destinationColumn) {
            return res.status(404).json({ message: "column not found" });
        }

        const task = sourceColumn.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: "task not found" });
        }

        const safeDestinationIndex = Math.max(
            0,
            Math.min(destinationIndex ?? 0, destinationColumn.tasks.length)
        );

        if (sourceColumnId === destinationColumnId) {
            const taskIndex = sourceColumn.tasks.findIndex(
                t => t._id.toString() === taskId
            );

            if (taskIndex === -1) {
                return res.status(404).json({
                    message: "task not found in column"
                });
            }

            const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);

            sourceColumn.tasks.splice(safeDestinationIndex, 0, movedTask);
        } 
        else {
            sourceColumn.tasks.pull(taskId);

            destinationColumn.tasks.splice(
                safeDestinationIndex,
                0,
                task
            );
        }

        await board.save();

        return res.json(board);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "internal server error"
        });
    }
});

app.listen(3001, () => {
    console.log("server is running on port 3001")
})