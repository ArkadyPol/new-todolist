import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { tasksReducer } from '../features/TodolistsList/tasks-reducer'
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer'
import { appReducer } from './app-reducer'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

type AppActionType = ReturnType<typeof store.dispatch>
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<AppRootStateType, void, AppActionType>
export type ThunkType = ThunkAction<
  void,
  AppRootStateType,
  unknown,
  AppActionType
>

export default store
