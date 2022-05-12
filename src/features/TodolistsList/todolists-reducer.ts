import todolistAPI, { TodolistType } from '../..//api/todolist-api'
import { setAppStatus, RequestStatusType } from '../../app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'
import { AxiosError } from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export const fetchTodolists = createAsyncThunk(
  'todolists/fetchTodolists',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus('loading'))
    try {
      const { data } = await todolistAPI.getTodolists()
      dispatch(setAppStatus('succeeded'))
      return data
    } catch (err) {
      const error = err as AxiosError
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  }
)
export const removeTodolist = createAsyncThunk(
  'todolists/removeTodolist',
  async (id: string, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodolistEntityStatus({ id, status: 'loading' }))
    try {
      const { data } = await todolistAPI.deleteTodolist(id)
      if (data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'))
        return id
      } else {
        handleServerAppError(data, dispatch)
        return rejectWithValue(null)
      }
    } catch (err) {
      const error = err as AxiosError
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  }
)
export const addTodolist = createAsyncThunk(
  'todolists/addTodolist',
  async (title: string, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus('loading'))
    try {
      const { data } = await todolistAPI.createTodolist(title)
      if (data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'))
        return data.data.item
      } else {
        handleServerAppError(data, dispatch)
        return rejectWithValue(null)
      }
    } catch (err) {
      const error = err as AxiosError
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  }
)
export const changeTodolistTitle = createAsyncThunk(
  'todolists/changeTodolistTitle',
  async (
    param: { id: string; title: string },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(setAppStatus('loading'))
    try {
      const { data } = await todolistAPI.updateTodolist(param.id, param.title)
      if (data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'))
        return param
      } else {
        handleServerAppError(data, dispatch)
        return rejectWithValue(null)
      }
    } catch (err) {
      const error = err as AxiosError
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  }
)

const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [] as TodolistDomainType[],
  reducers: {
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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodolists.fulfilled, (_state, action) => {
        return action.payload.map(tl => ({
          ...tl,
          filter: 'all',
          entityStatus: 'idle',
        }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        return state.filter(tl => tl.id !== action.payload)
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload,
          filter: 'all',
          entityStatus: 'idle',
        })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const { id, title } = action.payload
        const todolist = state.find(tl => tl.id === id)
        if (todolist) {
          todolist.title = title
        }
      })
  },
})

export const todolistsReducer = todolistsSlice.reducer
export const { changeTodolistFilter, changeTodolistEntityStatus } =
  todolistsSlice.actions

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
