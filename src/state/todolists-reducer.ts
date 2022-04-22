import { v1 } from 'uuid'
import { FilterValuesType, TodolistType } from '../App'

type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST'
  id: string
}
type AddTodolistActionType = {
  type: 'ADD-TODOLIST'
  title: string
}
type ChangeTodolistTitleActionType = {
  type: 'CHANGE-TODOLIST-TITLE'
  id: string
  title: string
}
type ChangeTodolistFilterActionType = {
  type: 'CHANGE-TODOLIST-FILTER'
  id: string
  filter: FilterValuesType
}

type ActionType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType

export const todolistsReducer = (
  state: TodolistType[],
  action: ActionType
): TodolistType[] => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      return [...state, { id: v1(), title: action.title, filter: 'all' }]
    case 'CHANGE-TODOLIST-TITLE':
      return state.map(tl =>
        tl.id === action.id ? { ...tl, title: action.title } : tl
      )
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(tl =>
        tl.id === action.id ? { ...tl, filter: action.filter } : tl
      )
    default:
      throw new Error("I don't understand this type")
  }
}

export const RemoveTodolistAC = (id: string): RemoveTodolistActionType => ({
  type: 'REMOVE-TODOLIST',
  id,
})
export const AddTodolistAC = (title: string): AddTodolistActionType => ({
  type: 'ADD-TODOLIST',
  title,
})
export const ChangeTodolistTitleAC = (
  title: string,
  id: string
): ChangeTodolistTitleActionType => ({
  type: 'CHANGE-TODOLIST-TITLE',
  title,
  id,
})
export const ChangeTodolistFilterAC = (
  filter: FilterValuesType,
  id: string
): ChangeTodolistFilterActionType => ({
  type: 'CHANGE-TODOLIST-FILTER',
  filter,
  id,
})
