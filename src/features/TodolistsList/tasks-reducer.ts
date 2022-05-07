import { AxiosError } from 'axios'
import todolistAPI, {
  TaskType,
  UpdateTaskModelType,
} from '../../api/todolist-api'
import { setAppErrorAC, setAppStatusAC } from '../../app/app-reducer'
import { ThunkType } from '../../app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'
import {
  AddTodolistAT,
  RemoveTodolistAT,
  SetTodolistsAT,
} from './todolists-reducer'

const initialState: TasksStateType = {}

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionType
): TasksStateType => {
  switch (action.type) {
    case 'SET-TODOLISTS':
      return Object.fromEntries(action.todolists.map(tl => [tl.id, []]))
    case 'SET-TASKS':
      return { ...state, [action.todolistId]: action.tasks }
    case 'REMOVE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          t => t.id !== action.taskId
        ),
      }
    case 'ADD-TASK':
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId],
        ],
      }
    case 'UPDATE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(t =>
          t.id === action.taskId ? { ...t, ...action.model } : t
        ),
      }
    case 'ADD-TODOLIST':
      return {
        ...state,
        [action.todolist.id]: [],
      }
    case 'REMOVE-TODOLIST':
      const stateCopy = { ...state }
      delete stateCopy[action.id]
      return stateCopy
    default:
      return state
  }
}

export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({ type: 'REMOVE-TASK', taskId, todolistId } as const)
export const addTaskAC = (task: TaskType) =>
  ({ type: 'ADD-TASK', task } as const)
export const updateTaskAC = (
  taskId: string,
  todolistId: string,
  model: UpdateDomainTaskModelType
) => ({ type: 'UPDATE-TASK', taskId, todolistId, model } as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
  ({ type: 'SET-TASKS', tasks, todolistId } as const)

export const fetchTasksTC =
  (todolistId: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI
      .getTasks(todolistId)
      .then(({ data }) => {
        if (data.error === null) {
          dispatch(setTasksAC(data.items, todolistId))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          dispatch(setAppErrorAC(data.error))
          dispatch(setAppStatusAC('failed'))
        }
      })
      .catch((error: AxiosError) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const removeTaskTC =
  (taskId: string, todolistId: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI
      .deleteTask(todolistId, taskId)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(removeTaskAC(taskId, todolistId))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          handleServerAppError(data, dispatch)
        }
      })
      .catch((error: AxiosError) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const addTaskTC =
  (title: string, todolistId: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI
      .createTask(todolistId, title)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(addTaskAC(data.data.item))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          handleServerAppError(data, dispatch)
        }
      })
      .catch((error: AxiosError) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const updateTaskTC =
  (
    taskId: string,
    todolistId: string,
    domainModel: UpdateDomainTaskModelType
  ): ThunkType =>
  (dispatch, getState) => {
    dispatch(setAppStatusAC('loading'))
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModelType = {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        ...domainModel,
      }

      todolistAPI
        .updateTask(todolistId, taskId, apiModel)
        .then(({ data }) => {
          if (data.resultCode === 0) {
            dispatch(updateTaskAC(taskId, todolistId, apiModel))
            dispatch(setAppStatusAC('succeeded'))
          } else {
            handleServerAppError(data, dispatch)
          }
        })
        .catch((error: AxiosError) => {
          handleServerNetworkError(error, dispatch)
        })
    }
  }

type ActionType =
  | AddTodolistAT
  | RemoveTodolistAT
  | SetTodolistsAT
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof setTasksAC>
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: number
  priority?: number
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [todolistId: string]: TaskType[]
}
