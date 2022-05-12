import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import {
  authAPI,
  FieldErrorType,
  LoginParamsType,
} from '../../api/todolist-api'
import { setAppStatus } from '../../app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'

export const login = createAsyncThunk<
  undefined,
  LoginParamsType,
  {
    rejectValue: {
      errors: string[]
      fieldsErrors?: FieldErrorType[]
    }
  }
>('auth/login', async (param, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatus('loading'))
  try {
    const { data } = await authAPI.login(param)
    if (data.resultCode === 0) {
      dispatch(setAppStatus('succeeded'))
    } else {
      handleServerAppError(data, dispatch)
      return rejectWithValue({
        errors: data.messages,
        fieldsErrors: data.fieldsErrors,
      })
    }
  } catch (err) {
    const error = err as AxiosError
    handleServerNetworkError(error, dispatch)
    return rejectWithValue({
      errors: [error.message],
    })
  }
})

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus('loading'))
    try {
      const { data } = await authAPI.logout()
      if (data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'))
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

const authSlice = createSlice({
  name: 'auth',
  initialState: { isLoggedIn: false },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, state => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, state => {
        state.isLoggedIn = false
      })
  },
})

export const authReducer = authSlice.reducer
export const { setIsLoggedIn } = authSlice.actions

export type InitialStateType = ReturnType<typeof authSlice.getInitialState>
