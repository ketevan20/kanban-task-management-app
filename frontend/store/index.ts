import boardsReducer from './slices/boardsSlice'
import columnsReducer from './slices/columnsSlice'
import tasksReducer from './slices/tasksSlice'
import subtasksReducer from './slices/subtasksSlice'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
    reducer: {
        boards: boardsReducer,
        columns: columnsReducer,
        tasks: tasksReducer,
        subtasks: subtasksReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector