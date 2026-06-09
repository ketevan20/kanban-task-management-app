import axios from "axios";
import { AppDispatch, RootState } from "..";
import { addTask, deleteTask, moveTask } from "../slices/tasksSlice";
import { Task } from "@/types";

export const createTask = ({ columnId, boardId, title, description, subtasks }: Omit<Task, "_id" | "order"> & { subtasks?: { title: string }[] }) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
            columnId: columnId,
            boardId: boardId,
            title: title,
            description: description,
            subtasks: subtasks
        })
        dispatch(addTask(res.data))
    } catch (err) {
        console.error(err)
    }
}

export const removeTask = (taskId: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`)
        dispatch(deleteTask(taskId))
    } catch (err) {
        console.error(err)
    }
}

export const dragTask = (taskId: string, destinationColumnId: string, destinationIndex: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const previousTask = getState().tasks.entities[taskId]
    try {
        dispatch(moveTask({ taskId, destinationColumnId, destinationIndex }))
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/move`, {
            destinationColumnId,
            destinationIndex
        })
    } catch (err) {
        dispatch(moveTask({
            taskId,
            destinationColumnId: previousTask.columnId,
            destinationIndex: previousTask.order
        }))
        console.error(err)
    }
}