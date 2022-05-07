import { Dispatch } from 'redux'
import { ResponseType } from '../api/todolist-api'
import {
  setAppErrorAC,
  SetAppErrorAT,
  setAppStatusAC,
  SetAppStatusAT,
} from '../app/app-reducer'

export const handleServerAppError = <T>(
  data: ResponseType<T>,
  dispatch: ErrorUtilsDispatchType
) => {
  const error = data.messages.length ? data.messages[0] : 'Some error occurred'
  dispatch(setAppErrorAC(error))
  dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: ErrorUtilsDispatchType
) => {
  dispatch(setAppErrorAC(error?.message ? error.message : 'Some error occured'))
  dispatch(setAppStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorAT | SetAppStatusAT>
