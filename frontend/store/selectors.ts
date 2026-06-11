import { RootState } from ".";

export const selectAllBoards = (state: RootState) => Object.values(state.boards.entities)

export const selectActiveBoard = (state: RootState) =>
  state.boards.activeBoardId ? state.boards.entities[state.boards.activeBoardId] : null

export const selectColumnsByBoard = (boardId: string) => (state: RootState) =>
    Object.values(state.columns.entities)
        .filter(col => col.boardId === boardId)
        .sort((a, b) => a.order - b.order)

export const selectTasksByColumn = (columnId: string) => (state: RootState) =>
    Object.values(state.tasks.entities)
        .filter(task => task.columnId === columnId)
        .sort((a, b) => a.order - b.order)

export const selectSubtasksByTask = (taskId: string) => (state: RootState) =>
    Object.values(state.subtasks.entities)
        .filter(subtask => subtask.taskId === taskId)

        
export const selectActiveModal = (state: RootState) => state.ui.activeModal
export const selectSelectedTaskId = (state: RootState) => state.ui.selectedTaskId
export const selectSelectedColumnId = (state: RootState) => state.ui.selectedColumnId