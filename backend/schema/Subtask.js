const mongoose = require("mongoose")

const subtaskSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Subtask", subtaskSchema)