import { ThunkAction } from 'redux-thunk'
import todolistAPI, { TaskType, UpdateTaskModelType } from '../api/todolist-api'
import { TasksStateType } from '../App'
import { AppRootStateType } from './store'
import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType,
} from './todolists-reducer'

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type UpdateTaskACActionType = ReturnType<typeof updateTaskAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>

type ActionType =
  | RemoveTaskActionType
  | AddTaskActionType
  | UpdateTaskACActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
  | SetTasksActionType

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
  ({
    type: 'REMOVE-TASK',
    taskId,
    todolistId,
  } as const)

export const addTaskAC = (task: TaskType) =>
  ({
    type: 'ADD-TASK',
    task,
  } as const)

export const updateTaskAC = (
  taskId: string,
  todolistId: string,
  model: UpdateDomainTaskModelType
) =>
  ({
    type: 'UPDATE-TASK',
    taskId,
    todolistId,
    model,
  } as const)

export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
  ({
    type: 'SET-TASKS',
    tasks,
    todolistId,
  } as const)

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionType>

export const fetchTasksTC =
  (todolistId: string): ThunkType =>
  dispatch => {
    todolistAPI.getTasks(todolistId).then(res => {
      dispatch(setTasksAC(res.data.items, todolistId))
    })
  }

export const removeTaskTC =
  (taskId: string, todolistId: string): ThunkType =>
  dispatch => {
    todolistAPI.deleteTask(todolistId, taskId).then(() => {
      dispatch(removeTaskAC(taskId, todolistId))
    })
  }
export const addTaskTC =
  (title: string, todolistId: string): ThunkType =>
  dispatch => {
    todolistAPI.createTask(todolistId, title).then(res => {
      dispatch(addTaskAC(res.data.data.item))
    })
  }

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: number
  priority?: number
  startDate?: string
  deadline?: string
}

export const updateTaskTC =
  (
    taskId: string,
    todolistId: string,
    domainModel: UpdateDomainTaskModelType
  ): ThunkType =>
  (dispatch, getState) => {
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

      todolistAPI.updateTask(todolistId, taskId, apiModel).then(() => {
        dispatch(updateTaskAC(taskId, todolistId, apiModel))
      })
    }
  }
