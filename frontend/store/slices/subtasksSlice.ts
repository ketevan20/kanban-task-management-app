import { Subtask } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { entities: Record<string, Subtask> } = {
    entities: {},
}

const subtasksSlice = createSlice({
    name: "subtasks",
    initialState,
    reducers: {
        setSubtasks(state, action: PayloadAction<Subtask[]>) {
            action.payload.forEach(subtask => {
                state.entities[subtask._id] = subtask
            })
        },
        addSubtask(state, action: PayloadAction<Subtask>) {
            state.entities[action.payload._id] = action.payload
        },
        updateSubtask(state, action: PayloadAction<Subtask>) {
            if (state.entities[action.payload._id]) {
                state.entities[action.payload._id] = action.payload
            }
        },
        deleteSubtask(state, action: PayloadAction<string>) {
            if (state.entities[action.payload]) delete state.entities[action.payload]
        },
        toggleSubtask(state, action: PayloadAction<string>) {
            const sub = state.entities[action.payload]
            if (sub) sub.isCompleted = !sub.isCompleted
        }
    }
})

export default subtasksSlice.reducer

export const { setSubtasks, addSubtask, updateSubtask, deleteSubtask, toggleSubtask } = subtasksSlice.actions

