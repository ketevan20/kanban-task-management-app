export interface Board {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Column {
  _id: string
  boardId: string
  name: string
  order: number
}

export interface Task {
  _id: string
  columnId: string
  boardId: string
  title: string
  description: string
  order: number
}

export interface Subtask {
  _id: string
  taskId: string
  title: string
  isCompleted: boolean
}