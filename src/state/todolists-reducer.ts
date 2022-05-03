import todolistAPI, { TodolistType } from '../api/todolist-api'
import { AppRootStateType } from './store'
import { ThunkAction } from 'redux-thunk'

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

type ActionType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | SetTodolistsActionType

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
}

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionType
): TodolistDomainType[] => {
  switch (action.type) {
    case 'SET-TODOLISTS':
      return action.todolists.map(tl => ({ ...tl, filter: 'all' }))
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      const newTodolist: TodolistDomainType = {
        ...action.todolist,
        filter: 'all',
      }
      return [newTodolist, ...state]
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

export const removeTodolistAC = (id: string) =>
  ({
    type: 'REMOVE-TODOLIST',
    id,
  } as const)
export const addTodolistAC = (todolist: TodolistType) =>
  ({
    type: 'ADD-TODOLIST',
    todolist,
  } as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({
    type: 'CHANGE-TODOLIST-TITLE',
    title,
    id,
  } as const)
export const changeTodolistFilterAC = (filter: FilterValuesType, id: string) =>
  ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter,
    id,
  } as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
  ({
    type: 'SET-TODOLISTS',
    todolists,
  } as const)

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionType>

export const fetchTodolistsTC = (): ThunkType => dispatch => {
  todolistAPI.getTodolists().then(res => {
    dispatch(setTodolistsAC(res.data))
  })
}
export const removeTodolistTC =
  (id: string): ThunkType =>
  dispacth => {
    todolistAPI.deleteTodolist(id).then(() => {
      dispacth(removeTodolistAC(id))
    })
  }
export const addTodolistTC =
  (title: string): ThunkType =>
  dispactch => {
    todolistAPI.createTodolist(title).then(res => {
      dispactch(addTodolistAC(res.data.data.item))
    })
  }
export const changeTodolistTitleTC =
  (id: string, title: string): ThunkType =>
  dispactch => {
    todolistAPI.updateTodolist(id, title).then(() => {
      dispactch(changeTodolistTitleAC(id, title))
    })
  }
