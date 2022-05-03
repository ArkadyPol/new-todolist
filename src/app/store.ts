import { tasksReducer } from '../features/TodolistsList/tasks-reducer'
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension'
import thunk, { ThunkDispatch } from 'redux-thunk'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export type AppRootStateType = ReturnType<typeof rootReducer>

export default store

type AppActionType = ReturnType<typeof store.dispatch>

export type AppDispatch = ThunkDispatch<AppRootStateType, void, AppActionType>
