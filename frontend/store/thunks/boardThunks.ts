import axios from 'axios'
import { AppDispatch } from '..'
import { addBoard, deleteBoard, setActiveBoardId, setBoards, updateBoard } from '../slices/boardsSlice'
import { setColumns } from '../slices/columnsSlice'
import { setTasks } from '../slices/tasksSlice'
import { setSubtasks } from '../slices/subtasksSlice'

export const fetchBoards = () => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/boards`)
        if(res.data.length > 0) dispatch(setActiveBoardId(res.data[0]._id))
        dispatch(setBoards(res.data))
    } catch (err) {
        console.error("fetchBoards failed:", err)
    }
}

export const fetchBoard = (boardId: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`)
        const data = res.data

        const { columns, ...board } = data

        const allColumns = columns.map(({ tasks, ...col }: any) => col)
        const allTasks = columns.flatMap((col: any) => col.tasks.map(({ subtasks, ...task }: any) => task))
        const allSubtasks = columns.flatMap((col: any) => col.tasks.flatMap((task: any) => task.subtasks))

        dispatch(setActiveBoardId(board._id))
        dispatch(updateBoard(board))
        dispatch(setColumns(allColumns))
        dispatch(setTasks(allTasks))
        dispatch(setSubtasks(allSubtasks))
    } catch (err) {
        console.error(err)
    }
}

export const createBoard = (name: string, columns: any) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/boards`, {
            name: name,
            columns: columns
        })
        dispatch(addBoard(res.data))
    } catch (err) {
        console.error(err)
    }
}

export const editBoard = (boardId: string, name: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`, {
            name: name
        })
        dispatch(updateBoard(res.data))
    } catch (err) {
        console.error(err)
    }
}

export const removeBoard = (boardId: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`)
        dispatch(deleteBoard(boardId))
    } catch(err) {
        console.error(err)
    }
}