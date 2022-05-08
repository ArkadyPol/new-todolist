import { AxiosError } from 'axios'
import { authAPI, LoginParamsType } from '../../api/todolist-api'
import { setAppStatusAC } from '../../app/app-reducer'
import { ThunkType } from '../../app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'

const initialState = {
  isLoggedIn: false,
}
type InitialStateType = typeof initialState

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return { ...state, isLoggedIn: action.value }
    default:
      return state
  }
}

export const setIsLoggedInAC = (value: boolean) =>
  ({ type: 'login/SET-IS-LOGGED-IN', value } as const)

export const loginTC =
  (data: LoginParamsType): ThunkType =>
  dispatch => {
    dispatch(setAppStatusAC('loading'))
    authAPI
      .login(data)
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
  }
export const logoutTC = (): ThunkType => dispatch => {
  dispatch(setAppStatusAC('loading'))
  authAPI
    .logout()
    .then(({ data }) => {
      if (data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false))
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}

type ActionsType = ReturnType<typeof setIsLoggedInAC>
