import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import { tasksReducer } from '../features/TodolistsList/tasks-reducer'
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer'
import { appReducer } from './app-reducer'
import { authReducer } from '../features/Login/auth-reducer'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

type AppDispatch = typeof store.dispatch
export type AppRootStateType = ReturnType<typeof rootReducer>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> =
  useSelector

export default store
