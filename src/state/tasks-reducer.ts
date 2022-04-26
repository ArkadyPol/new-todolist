import { v1 } from 'uuid'
import { TasksStateType } from '../App'
import { TaskType } from '../Todolist'
import {
  AddTodolistActionType,
  RemoveTodolistActionType,
} from './todolists-reducer'

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

type ActionType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodolistActionType
  | RemoveTodolistActionType

const initialState: TasksStateType = {}

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionType
): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          t => t.id !== action.taskId
        ),
      }
    case 'ADD-TASK':
      const newTask: TaskType = { id: v1(), title: action.title, isDone: false }
      return {
        ...state,
        [action.todolistId]: [newTask, ...state[action.todolistId]],
      }
    case 'CHANGE-TASK-STATUS':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(t =>
          t.id === action.taskId ? { ...t, isDone: action.isDone } : t
        ),
      }
    case 'CHANGE-TASK-TITLE':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(t =>
          t.id === action.taskId ? { ...t, title: action.title } : t
        ),
      }
    case 'ADD-TODOLIST':
      return {
        ...state,
        [action.todolistId]: [],
      }
    case 'REMOVE-TODOLIST':
      const stateCopy = { ...state }
      delete stateCopy[action.id]
      return stateCopy
    default:
      return state
  }
}

export const removeTaskAC = (taskId: string, todolistId: string) => ({
  type: 'REMOVE-TASK' as const,
  taskId,
  todolistId,
})

export const addTaskAC = (title: string, todolistId: string) => ({
  type: 'ADD-TASK' as const,
  title,
  todolistId,
})

export const changeTaskStatusAC = (
  taskId: string,
  isDone: boolean,
  todolistId: string
) => ({
  type: 'CHANGE-TASK-STATUS' as const,
  taskId,
  isDone,
  todolistId,
})

export const changeTaskTitleAC = (
  taskId: string,
  title: string,
  todolistId: string
) => ({
  type: 'CHANGE-TASK-TITLE' as const,
  taskId,
  title,
  todolistId,
})
