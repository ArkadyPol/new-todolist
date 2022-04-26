import { v1 } from 'uuid'
import { FilterValuesType, TodolistType } from '../App'

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>

type ActionType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType

const initialState: TodolistType[] = []

export const todolistsReducer = (
  state: TodolistType[] = initialState,
  action: ActionType
): TodolistType[] => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      return [
        { id: action.todolistId, title: action.title, filter: 'all' },
        ...state,
      ]
    case 'CHANGE-TODOLIST-TITLE':
      return state.map(tl =>
        tl.id === action.id ? { ...tl, title: action.title } : tl
      )
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(tl =>
        tl.id === action.id ? { ...tl, filter: action.filter } : tl
      )
    default:
      return state
  }
}

export const removeTodolistAC = (id: string) => ({
  type: 'REMOVE-TODOLIST' as const,
  id,
})
export const addTodolistAC = (title: string) => ({
  type: 'ADD-TODOLIST' as const,
  title,
  todolistId: v1(),
})
export const changeTodolistTitleAC = (title: string, id: string) => ({
  type: 'CHANGE-TODOLIST-TITLE' as const,
  title,
  id,
})
export const changeTodolistFilterAC = (
  filter: FilterValuesType,
  id: string
) => ({
  type: 'CHANGE-TODOLIST-FILTER' as const,
  filter,
  id,
})
