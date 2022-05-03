import todolistAPI, { TodolistType } from '../..//api/todolist-api'
import { AppRootStateType } from '../../app/store'
import { ThunkAction } from 'redux-thunk'

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionType
): TodolistDomainType[] => {
  switch (action.type) {
    case 'SET-TODOLISTS':
      return action.todolists.map(tl => ({ ...tl, filter: 'all' }))
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      return [{ ...action.todolist, filter: 'all' }, ...state]
    case 'CHANGE-TODOLIST-TITLE':
      return state.map(tl =>
        tl.id === action.id ? { ...tl, title: action.title } : tl
      )
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(tl =>
        tl.id === action.id ? { ...tl, filter: action.filter } : tl
      )
    default:
      return state
  }
}

export const removeTodolistAC = (id: string) =>
  ({ type: 'REMOVE-TODOLIST', id } as const)
export const addTodolistAC = (todolist: TodolistType) =>
  ({ type: 'ADD-TODOLIST', todolist } as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({ type: 'CHANGE-TODOLIST-TITLE', title, id } as const)
export const changeTodolistFilterAC = (filter: FilterValuesType, id: string) =>
  ({ type: 'CHANGE-TODOLIST-FILTER', filter, id } as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
  ({ type: 'SET-TODOLISTS', todolists } as const)

export const fetchTodolistsTC = (): ThunkType => dispatch => {
  todolistAPI.getTodolists().then(res => {
    dispatch(setTodolistsAC(res.data))
  })
}
export const removeTodolistTC =
  (id: string): ThunkType =>
  dispacth => {
    todolistAPI.deleteTodolist(id).then(() => {
      dispacth(removeTodolistAC(id))
    })
  }
export const addTodolistTC =
  (title: string): ThunkType =>
  dispactch => {
    todolistAPI.createTodolist(title).then(res => {
      dispactch(addTodolistAC(res.data.data.item))
    })
  }
export const changeTodolistTitleTC =
  (id: string, title: string): ThunkType =>
  dispactch => {
    todolistAPI.updateTodolist(id, title).then(() => {
      dispactch(changeTodolistTitleAC(id, title))
    })
  }

type ActionType =
  | SetTodolistsAT
  | AddTodolistAT
  | RemoveTodolistAT
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionType>
export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
}
