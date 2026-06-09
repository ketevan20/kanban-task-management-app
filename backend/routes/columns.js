const router = require("express").Router()
const Column = require("../schema/Column")
const Task = require("../schema/Task")
const Subtask = require("../schema/Subtask")
const Board = require("../schema/Board")
const validateObjectId = require("../middleware/validateObjectId")

router.post("/", async (req, res) => {
  try {
    const { boardId, name } = req.body
    if (!boardId || !name) return res.status(400).json({ message: "boardId and name are required" })

    const board = await Board.findById(boardId)
    if (!board) return res.status(404).json({ message: "board not found" })

    const lastColumn = await Column.findOne({ boardId }).sort({ order: -1 })
    const order = lastColumn ? lastColumn.order + 1 : 0

    const column = await Column.create({ boardId, name, order })
    res.status(201).json(column)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.put("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const { name } = req.body
    const column = await Column.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    )
    if (!column) return res.status(404).json({ message: "column not found" })
    res.json(column)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.delete("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const column = await Column.findByIdAndDelete(req.params.id)
    if (!column) return res.status(404).json({ message: "column not found" })

    const tasks = await Task.find({ columnId: column._id })
    const taskIds = tasks.map(t => t._id)

    await Subtask.deleteMany({ taskId: { $in: taskIds } })
    await Task.deleteMany({ columnId: column._id })

    res.json({ message: "column deleted" })
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

module.exports = router