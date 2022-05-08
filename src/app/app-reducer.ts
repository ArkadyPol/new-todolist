import { authAPI } from '../api/todolist-api'
import { ThunkType } from './store'
import { setIsLoggedIn } from '../features/Login/auth-reducer'
import { AxiosError } from 'axios'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload
    },
    setAppStatus(state, action: PayloadAction<RequestStatusType>) {
      state.status = action.payload
    },
    setAppError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const appReducer = appSlice.reducer
export const { setIsInitialized, setAppStatus, setAppError } = appSlice.actions

export const initializeAppTC = (): ThunkType => dispatch => {
  dispatch(setAppStatus('loading'))
  authAPI
    .me()
    .then(({ data }) => {
      if (data.resultCode === 0) {
        dispatch(setIsLoggedIn(true))
        dispatch(setAppStatus('succeeded'))
      } else {
        handleServerAppError(data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitialized(true))
    })
}

export type SetAppStatusAT = ReturnType<typeof setAppStatus>
export type SetAppErrorAT = ReturnType<typeof setAppError>
export type InitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
