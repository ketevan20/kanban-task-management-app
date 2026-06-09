import { Board } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { entities: Record<string, Board>; activeBoardId: string | null } = {
    entities: {},
    activeBoardId: null
}

const boardsSlice = createSlice({
    name: "boards",
    initialState,
    reducers: {
        setBoards(state, action: PayloadAction<Board []>) {
            state.entities = Object.fromEntries(action.payload.map(board => [board._id, board]))
        },
        addBoard(state, action: PayloadAction<Board>) {
            state.entities[action.payload._id] = action.payload
        },
        updateBoard(state, action: PayloadAction<Board>) {
            if(state.entities[action.payload._id]) {
                state.entities[action.payload._id] = action.payload
            }
        },
        deleteBoard(state, action: PayloadAction<string>) {
            delete state.entities[action.payload]
            if (state.activeBoardId === action.payload) state.activeBoardId = null
        },
        setActiveBoardId(state, action: PayloadAction<string>) {
            state.activeBoardId = action.payload
        }
    }
})

export default boardsSlice.reducer

export const { setBoards, addBoard, updateBoard, deleteBoard, setActiveBoardId} = boardsSlice.actions