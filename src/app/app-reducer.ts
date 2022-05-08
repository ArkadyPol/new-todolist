import { authAPI } from '../api/todolist-api'
import { ThunkType } from './store'
import { setIsLoggedInAC } from '../features/Login/auth-reducer'
import { AxiosError } from 'axios'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../utils/error-utils'

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
}

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionType
): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status }
    case 'APP/SET-ERROR':
      return { ...state, error: action.error }
    case 'APP/SET-IS-INITIALIZED':
      return { ...state, isInitialized: action.value }
    default:
      return state
  }
}

export const setAppStatusAC = (status: RequestStatusType) =>
  ({ type: 'APP/SET-STATUS', status } as const)
export const setAppErrorAC = (error: string | null) =>
  ({ type: 'APP/SET-ERROR', error } as const)
export const setIsInitializedAC = (value: boolean) =>
  ({ type: 'APP/SET-IS-INITIALIZED', value } as const)

export const initializeAppTC = (): ThunkType => dispatch => {
  dispatch(setAppStatusAC('loading'))
  authAPI
    .me()
    .then(({ data }) => {
      if (data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true))
    })
}

type ActionType =
  | SetAppStatusAT
  | SetAppErrorAT
  | ReturnType<typeof setIsInitializedAC>
export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>
export type SetAppErrorAT = ReturnType<typeof setAppErrorAC>
export type InitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
