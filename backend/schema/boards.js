const { Schema, default: mongoose } = require("mongoose");

const subtaskSchema = new mongoose.Schema(
  {
    title: String,
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    subtasks: [subtaskSchema],
  },
  {
    _id: true,
  }
);

const columnSchema = new mongoose.Schema(
  {
    name: String,
    tasks: [taskSchema],
  },
  {
    _id: true,
  }
);

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    columns: [columnSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Board", boardSchema);