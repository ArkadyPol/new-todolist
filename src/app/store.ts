import { ThunkAction } from 'redux-thunk'
import { useDispatch } from 'react-redux'
import { tasksReducer } from '../features/TodolistsList/tasks-reducer'
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer'
import { appReducer } from './app-reducer'
import { authReducer } from '../features/Login/auth-reducer'
import { configureStore, combineReducers, AnyAction } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, AnyAction>

export default store
