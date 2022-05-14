import { authAPI } from '../api/todolist-api'
import { setIsLoggedIn } from '../features/Login/auth-reducer'
import { AxiosError } from 'axios'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../utils/error-utils'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchTodolists } from '../features/TodolistsList/todolists-reducer'

export const initializeApp = createAsyncThunk(
  'app/initializeApp',
  async (_, { dispatch }) => {
    dispatch(setAppStatus('loading'))
    try {
      const { data } = await authAPI.me()
      if (data.resultCode === 0) {
        dispatch(setIsLoggedIn(true))
        dispatch(setAppStatus('succeeded'))
        dispatch(fetchTodolists())
      } else {
        handleServerAppError(data, dispatch)
      }
    } catch (err) {
      const error = err as AxiosError
      handleServerNetworkError(error, dispatch)
    }
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppStatus(state, action: PayloadAction<RequestStatusType>) {
      state.status = action.payload
    },
    setAppError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
  extraReducers: buider => {
    buider.addCase(initializeApp.fulfilled, state => {
      state.isInitialized = true
    })
  },
})

export const appReducer = appSlice.reducer
export const { setAppStatus, setAppError } = appSlice.actions

export type SetAppStatusAT = ReturnType<typeof setAppStatus>
export type SetAppErrorAT = ReturnType<typeof setAppError>
export type InitialStateType = ReturnType<typeof appSlice.getInitialState>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
