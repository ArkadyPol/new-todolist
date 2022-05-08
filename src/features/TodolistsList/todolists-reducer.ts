import todolistAPI, { TodolistType } from '../..//api/todolist-api'
import { ThunkType } from '../../app/store'
import { setAppStatus, RequestStatusType } from '../../app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'
import { AxiosError } from 'axios'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: TodolistDomainType[] = []

const todolistsSlice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    setTodolists(_state, action: PayloadAction<TodolistType[]>) {
      return action.payload.map(tl => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
    },
    addTodolist(state, action: PayloadAction<TodolistType>) {
      state.unshift({ ...action.payload, filter: 'all', entityStatus: 'idle' })
    },
    changeTodolistTitle(
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) {
      const { id, title } = action.payload
      const todolist = state.find(tl => tl.id === id)
      if (todolist) {
        todolist.title = title
      }
    },
    changeTodolistFilter(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const { id, filter } = action.payload
      const todolist = state.find(tl => tl.id === id)
      if (todolist) {
        todolist.filter = filter
      }
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      const { id, status } = action.payload
      const todolist = state.find(tl => tl.id === id)
      if (todolist) {
        todolist.entityStatus = status
      }
    },
    removeTodolist(state, action: PayloadAction<string>) {
      return state.filter(tl => tl.id !== action.payload)
    },
  },
})

export const todolistsReducer = todolistsSlice.reducer
export const {
  setTodolists,
  addTodolist,
  changeTodolistTitle,
  changeTodolistFilter,
  changeTodolistEntityStatus,
  removeTodolist,
} = todolistsSlice.actions

export const fetchTodolistsTC = (): ThunkType => dispatch => {
  dispatch(setAppStatus('loading'))
  todolistAPI
    .getTodolists()
    .then(({ data }) => {
      dispatch(setTodolists(data))
      dispatch(setAppStatus('succeeded'))
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const removeTodolistTC =
  (id: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodolistEntityStatus({ id, status: 'loading' }))
    todolistAPI
      .deleteTodolist(id)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(removeTodolist(id))
          dispatch(setAppStatus('succeeded'))
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
    dispatch(setAppStatus('loading'))
    todolistAPI
      .createTodolist(title)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(addTodolist(data.data.item))
          dispatch(setAppStatus('succeeded'))
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
    dispatch(setAppStatus('loading'))
    todolistAPI
      .updateTodolist(id, title)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(changeTodolistTitle({ id, title }))
          dispatch(setAppStatus('succeeded'))
        } else {
          handleServerAppError(data, dispatch)
        }
      })
      .catch((error: AxiosError) => {
        handleServerNetworkError(error, dispatch)
      })
  }

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
