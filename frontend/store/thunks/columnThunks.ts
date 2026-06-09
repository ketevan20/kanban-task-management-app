import axios from "axios";
import { AppDispatch } from "..";
import { addColumn, deleteColumn, updateColumn } from "../slices/columnsSlice";

export const createColumn = (boardId: string, name: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/columns`, {
            boardId: boardId,
            name: name
        })
        dispatch(addColumn(res.data))
    } catch (err) {
        console.error(err)
    }
}

export const editColumn = (columnId: string, name: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/columns/${columnId}`, {
            name: name
        })
        dispatch(updateColumn(res.data))
    } catch(err) {
        console.error(err)
    }
}

export const removeColumn = (columnId: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/columns/${columnId}`)
        dispatch(deleteColumn(columnId))
    } catch(err) {
        console.error(err)
    }
}