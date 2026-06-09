const router = require("express").Router()
const Board = require("../schema/Board")
const Column = require("../schema/Column")
const Task = require("../schema/Task")
const Subtask = require("../schema/Subtask")
const validateObjectId = require("../middleware/validateObjectId")

router.get("/", async (req, res) => {
  try {
    const allBoards = await Board.find().sort({ createdAt: -1 })
    res.json(allBoards)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.get("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
    if (!board) return res.status(404).json({ message: "board not found" })

    const columns = await Column.find({ boardId: board._id }).sort({ order: 1 })

    const columnIds = columns.map(c => c._id)
    const tasks = await Task.find({ columnId: { $in: columnIds } }).sort({ order: 1 })
    const taskIds = tasks.map(t => t._id)
    const subtasks = await Subtask.find({ taskId: { $in: taskIds } })

    const result = {
      ...board.toObject(),
      columns: columns.map(col => ({
        ...col.toObject(),
        tasks: tasks
          .filter(t => t.columnId.toString() === col._id.toString())
          .map(task => ({
            ...task.toObject(),
            subtasks: subtasks.filter(s => s.taskId.toString() === task._id.toString())
          }))
      }))
    }

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { name, columns } = req.body
    if (!name) return res.status(400).json({ message: "name is required" })

    const board = await Board.create({ name })

    if (Array.isArray(columns) && columns.length > 0) {
      const columnDocs = columns.map((col, index) => ({
        boardId: board._id,
        name: col.name,
        order: index
      }))
      await Column.insertMany(columnDocs)
    }

    res.status(201).json(board)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.put("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const { name } = req.body
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    )
    if (!board) return res.status(404).json({ message: "board not found" })
    res.json(board)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.delete("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id)
    if (!board) return res.status(404).json({ message: "board not found" })

    const columns = await Column.find({ boardId: board._id })
    const columnIds = columns.map(c => c._id)
    const tasks = await Task.find({ columnId: { $in: columnIds } })
    const taskIds = tasks.map(t => t._id)

    await Subtask.deleteMany({ taskId: { $in: taskIds } })
    await Task.deleteMany({ columnId: { $in: columnIds } })
    await Column.deleteMany({ boardId: board._id })

    res.json({ message: "board deleted" })
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

module.exports = router