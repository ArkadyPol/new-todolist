import { Dispatch } from 'redux'
import { ResponseType } from '../api/todolist-api'
import {
  setAppError,
  SetAppErrorAT,
  setAppStatus,
  SetAppStatusAT,
} from '../app/app-reducer'

export const handleServerAppError = <T>(
  data: ResponseType<T>,
  dispatch: ErrorUtilsDispatchType
) => {
  const error = data.messages.length ? data.messages[0] : 'Some error occurred'
  dispatch(setAppError(error))
  dispatch(setAppStatus('failed'))
}

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: ErrorUtilsDispatchType
) => {
  dispatch(setAppError(error?.message ? error.message : 'Some error occured'))
  dispatch(setAppStatus('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorAT | SetAppStatusAT>
