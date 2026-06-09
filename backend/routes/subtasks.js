const router = require("express").Router()
const Subtask = require("../schema/Subtask")
const validateObjectId = require("../middleware/validateObjectId")

router.patch("/:id/toggle", validateObjectId("id"), async (req, res) => {
  try {
    const subtask = await Subtask.findById(req.params.id)
    if (!subtask) return res.status(404).json({ message: "subtask not found" })

    subtask.isCompleted = !subtask.isCompleted
    await subtask.save()

    res.json(subtask)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.put("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const { title } = req.body
    const subtask = await Subtask.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    )
    if (!subtask) return res.status(404).json({ message: "subtask not found" })
    res.json(subtask)
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

router.delete("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const subtask = await Subtask.findByIdAndDelete(req.params.id)
    if (!subtask) return res.status(404).json({ message: "subtask not found" })
    res.json({ message: "subtask deleted" })
  } catch (err) {
    res.status(500).json({ message: "internal server error" })
  }
})

module.exports = router