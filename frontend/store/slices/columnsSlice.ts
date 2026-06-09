import { Column } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { entities: Record<string, Column> } = {
    entities: {},
}

const columnsSlice = createSlice({
    name: "columns",
    initialState,
    reducers: {
        setColumns(state, action: PayloadAction<Column[]>) {
            action.payload.forEach(col => {
                state.entities[col._id] = col
            })
        },
        addColumn(state, action: PayloadAction<Column>) {
            state.entities[action.payload._id] = action.payload
        },
        updateColumn(state, action: PayloadAction<Column>) {
            if (state.entities[action.payload._id]) {
                state.entities[action.payload._id] = action.payload
            }
        },
        deleteColumn(state, action: PayloadAction<string>) {
            if(state.entities[action.payload]) delete state.entities[action.payload]
        }
    }
})

export default columnsSlice.reducer

export const { setColumns, addColumn, deleteColumn, updateColumn } = columnsSlice.actions

