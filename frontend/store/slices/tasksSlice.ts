import { Task } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { entities: Record<string, Task> } = {
    entities: {},
}

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks(state, action: PayloadAction<Task[]>) {
            action.payload.forEach(task => {
                state.entities[task._id] = task
            })
        },
        addTask(state, action: PayloadAction<Task>) {
            state.entities[action.payload._id] = action.payload
        },
        updateTask(state, action: PayloadAction<Task>) {
            if (state.entities[action.payload._id]) {
                state.entities[action.payload._id] = action.payload
            }
        },
        deleteTask(state, action: PayloadAction<string>) {
            if (state.entities[action.payload]) delete state.entities[action.payload]
        },
        moveTask(state, action: PayloadAction<{ taskId: string, destinationColumnId: string, destinationIndex: number }>) {
            const task = state.entities[action.payload.taskId]
            if (task) {
                task.columnId = action.payload.destinationColumnId
                task.order = action.payload.destinationIndex
            }
        }
    }
})

export default tasksSlice.reducer

export const { setTasks, addTask, updateTask, deleteTask, moveTask } = tasksSlice.actions

