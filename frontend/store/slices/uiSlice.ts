import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  activeModal: 
    | "createBoard" 
    | "editBoard" 
    | "createTask"
    | "editTask"
    | "taskDetail"
    | "deleteConfirm"
    | null
  selectedTaskId: string | null
  selectedColumnId: string | null
}

const initialState: UiState = {
    activeModal: null,
    selectedTaskId: null,
    selectedColumnId: null
}

const uiSlice = createSlice({
    name: 'ui',
    initialState, 
    reducers: {
        openModal: (state, action: PayloadAction<{modalName: UiState['activeModal'], taskId?: string, columnId?: string}>) => {
            state.activeModal = action.payload.modalName
            state.selectedTaskId = action.payload.taskId || null
            state.selectedColumnId = action.payload.columnId || null
        },
        closeModal: (state) => {
            state.activeModal = null
            state.selectedTaskId = null
            state.selectedColumnId = null
        }
    }
})

export default uiSlice.reducer

export const { openModal, closeModal } = uiSlice.actions