import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import todolistAPI, {
  TaskType,
  UpdateTaskModelType,
} from '../../api/todolist-api'
import { setAppError, setAppStatus } from '../../app/app-reducer'
import { ThunkType } from '../../app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'
import { addTodolist, removeTodolist, setTodolists } from './todolists-reducer'

const initialState: TasksStateType = {}

const takskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(
      state,
      action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>
    ) {
      const { tasks, todolistId } = action.payload
      state[todolistId] = tasks
    },
    addTask(state, action: PayloadAction<TaskType>) {
      state[action.payload.todoListId].unshift(action.payload)
    },
    updateTask(
      state,
      action: PayloadAction<{
        taskId: string
        todolistId: string
        model: UpdateDomainTaskModelType
      }>
    ) {
      const { taskId, todolistId, model } = action.payload
      const task = state[todolistId].find(t => t.id === taskId)
      if (task) {
        Object.assign(task, model)
      }
    },
    removeTask(
      state,
      action: PayloadAction<{ taskId: string; todolistId: string }>
    ) {
      const { taskId, todolistId } = action.payload
      state[todolistId] = state[todolistId].filter(t => t.id !== taskId)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(setTodolists, (state, action) => {
        action.payload.forEach(tl => {
          state[tl.id] = []
        })
      })
      .addCase(addTodolist, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload]
      })
  },
})

export const tasksReducer = takskSlice.reducer
export const { setTasks, addTask, updateTask, removeTask } = takskSlice.actions

export const fetchTasksTC =
  (todolistId: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatus('loading'))
    todolistAPI
      .getTasks(todolistId)
      .then(({ data }) => {
        if (data.error === null) {
          dispatch(setTasks({ tasks: data.items, todolistId }))
          dispatch(setAppStatus('succeeded'))
        } else {
          dispatch(setAppError(data.error))
          dispatch(setAppStatus('failed'))
        }
      })
      .catch((error: AxiosError) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const removeTaskTC =
  (taskId: string, todolistId: string): ThunkType =>
  dispatch => {
    dispatch(setAppStatus('loading'))
    todolistAPI
      .deleteTask(todolistId, taskId)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(removeTask({ taskId, todolistId }))
          dispatch(setAppStatus('succeeded'))
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
    dispatch(setAppStatus('loading'))
    todolistAPI
      .createTask(todolistId, title)
      .then(({ data }) => {
        if (data.resultCode === 0) {
          dispatch(addTask(data.data.item))
          dispatch(setAppStatus('succeeded'))
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
    model: UpdateDomainTaskModelType
  ): ThunkType =>
  (dispatch, getState) => {
    dispatch(setAppStatus('loading'))
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModelType = {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        ...model,
      }

      todolistAPI
        .updateTask(todolistId, taskId, apiModel)
        .then(({ data }) => {
          if (data.resultCode === 0) {
            dispatch(updateTask({ taskId, todolistId, model }))
            dispatch(setAppStatus('succeeded'))
          } else {
            handleServerAppError(data, dispatch)
          }
        })
        .catch((error: AxiosError) => {
          handleServerNetworkError(error, dispatch)
        })
    }
  }

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
