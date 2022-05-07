import todolistAPI, { TodolistType } from '../..//api/todolist-api'
import { ThunkType } from '../../app/store'
import { setAppStatusAC, RequestStatusType } from '../../app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'
import { AxiosError } from 'axios'

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionType
): TodolistDomainType[] => {
  switch (action.type) {
    case 'SET-TODOLISTS':
      return action.todolists.map(tl => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      return [
        { ...action.todolist, filter: 'all', entityStatus: 'idle' },
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
    case 'CHANGE-TODOLIST-ENTITY-STATUS':
      return state.map(tl =>
        tl.id === action.id ? { ...tl, entityStatus: action.entityStatus } : tl
      )
    default:
      return state
  }
}

export const removeTodolistAC = (id: string) =>
  ({ type: 'REMOVE-TODOLIST', id } as const)
export const addTodolistAC = (todolist: TodolistType) =>
  ({ type: 'ADD-TODOLIST', todolist } as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({ type: 'CHANGE-TODOLIST-TITLE', title, id } as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({ type: 'CHANGE-TODOLIST-FILTER', filter, id } as const)
export const changeTodolistEntityStatusAC = (
  id: string,
  entityStatus: RequestStatusType
) => ({ type: 'CHANGE-TODOLIST-ENTITY-STATUS', entityStatus, id } as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
  ({ type: 'SET-TODOLISTS', todolists } as const)

export const fetchTodolistsTC = (): ThunkType => dispatch => {
  dispatch(setAppStatusAC('loading'))
  todolistAPI
    .getTodolists()
    .then(({ data }) => {
      dispatch(setTodolistsAC(data))
      dispatch(setAppStatusAC('succeeded'))
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const removeTodolistTC =
  (id: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(id, 'loading'))
    todolistAPI
      .deleteTodolist(id)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(removeTodolistAC(id))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          handleServerAppError(data, dispatch)
        }
      })
      .catch((error: AxiosError) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const addTodolistTC =
  (title: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI
      .createTodolist(title)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(addTodolistAC(data.data.item))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          handleServerAppError(data, dispatch)
        }
      })
      .catch((error: AxiosError) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const changeTodolistTitleTC =
  (id: string, title: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI
      .updateTodolist(id, title)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(changeTodolistTitleAC(id, title))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          handleServerAppError(data, dispatch)
        }
      })
      .catch((error: AxiosError) => {
        handleServerNetworkError(error, dispatch)
      })
  }

type ActionType =
  | SetTodolistsAT
  | AddTodolistAT
  | RemoveTodolistAT
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof changeTodolistEntityStatusAC>
export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
