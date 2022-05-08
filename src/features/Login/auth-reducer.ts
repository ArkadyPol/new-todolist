import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { authAPI, LoginParamsType } from '../../api/todolist-api'
import { setAppStatus } from '../../app/app-reducer'
import { ThunkType } from '../../app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'

const initialState = {
  isLoggedIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload
    },
  },
})

export const authReducer = authSlice.reducer
export const { setIsLoggedIn } = authSlice.actions

export const loginTC =
  (data: LoginParamsType): ThunkType =>
  dispatch => {
    dispatch(setAppStatus('loading'))
    authAPI
      .login(data)
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
  }
export const logoutTC = (): ThunkType => dispatch => {
  dispatch(setAppStatus('loading'))
  authAPI
    .logout()
    .then(({ data }) => {
      if (data.resultCode === 0) {
        dispatch(setIsLoggedIn(false))
        dispatch(setAppStatus('succeeded'))
      } else {
        handleServerAppError(data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}

export type InitialStateType = typeof initialState
