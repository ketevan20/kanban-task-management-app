import axios from "axios";
import { AppDispatch } from "..";
import { deleteSubtask, updateSubtask, toggleSubtask as toggleSubtaskAction } from "../slices/subtasksSlice";

export const toggleSubtask = (subtaskId: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/subtasks/${subtaskId}/toggle`)
        dispatch(toggleSubtaskAction(subtaskId))
    } catch (err) {
        console.error(err)
    }
}

export const editSubtask = (subtaskId: string, title: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/subtasks/${subtaskId}`, {
            title: title
        })
        dispatch(updateSubtask(res.data))
    } catch(err) {
        console.error(err)
    }
}

export const removeSubtask = (subtaskId: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/subtasks/${subtaskId}`)
        dispatch(deleteSubtask(subtaskId))
    } catch(err) {
        console.error(err)
    }
}