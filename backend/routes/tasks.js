const router = require("express").Router()
const Task = require("../schema/Task")
const Subtask = require("../schema/Subtask")
const Column = require("../schema/Column")
const validateObjectId = require("../middleware/validateObjectId")

router.post("/", async (req, res) => {
  try {
    const { columnId, boardId, title, description, subtasks } = req.body
    if (!columnId || !boardId || !title)
      return res.status(400).json({ message: "columnId, boardId, and title are required" })

    const column = await Column.findById(columnId)
    if (!column) return res.status(404).json({ message: "column not found" })

    const lastTask = await Task.findOne({ columnId }).sort({ order: -1 })
    const order = lastTask ? lastTask.order + 1 : 0

    const task = await Task.create({ columnId, boardId, title, description, order })

    if (Array.isArray(subtasks) && subtasks.length > 0) {
      const subtaskDocs = subtasks.map(s => ({ taskId: task._id, title: s.title }))
      await Subtask.insertMany(subtaskDocs)
    }

    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.put("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const { title, description } = req.body
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    )
    if (!task) return res.status(404).json({ message: "task not found" })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

// DELETE /tasks/:id
router.delete("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: "task not found" })
    await Subtask.deleteMany({ taskId: task._id })
    res.json({ message: "task deleted" })
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

// PATCH /tasks/:id/move
router.patch("/:id/move", validateObjectId("id"), async (req, res) => {
  try {
    const { destinationColumnId, destinationIndex } = req.body
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: "task not found" })

    const isSameColumn = task.columnId.toString() === destinationColumnId

    // shift other tasks to make room
    await Task.updateMany(
      {
        columnId: destinationColumnId,
        order: { $gte: destinationIndex }
      },
      { $inc: { order: 1 } }
    )

    // remove the gap left in the source column if moving across columns
    if (!isSameColumn) {
      await Task.updateMany(
        { columnId: task.columnId, order: { $gt: task.order } },
        { $inc: { order: -1 } }
      )
    }

    task.columnId = destinationColumnId
    task.order = destinationIndex
    await task.save()

    res.json(task)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

module.exports = router