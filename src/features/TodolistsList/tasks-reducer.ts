import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import todolistAPI, {
  TaskType,
  UpdateTaskModelType,
} from '../../api/todolist-api'
import { setAppError, setAppStatus } from '../../app/app-reducer'
import { AppRootStateType } from '../../app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/error-utils'
import {
  addTodolist,
  removeTodolist,
  fetchTodolists,
} from './todolists-reducer'

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (todolistId: string, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus('loading'))
    try {
      const { data } = await todolistAPI.getTasks(todolistId)
      if (data.error === null) {
        dispatch(setAppStatus('succeeded'))
        return { tasks: data.items, todolistId }
      } else {
        dispatch(setAppError(data.error))
        dispatch(setAppStatus('failed'))
        return rejectWithValue(null)
      }
    } catch (err) {
      const error = err as AxiosError
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  }
)

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (
    param: { taskId: string; todolistId: string },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(setAppStatus('loading'))
    try {
      const { taskId, todolistId } = param
      const { data } = await todolistAPI.deleteTask(todolistId, taskId)
      if (data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'))
        return param
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

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (
    param: { title: string; todolistId: string },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(setAppStatus('loading'))
    try {
      const { title, todolistId } = param
      const { data } = await todolistAPI.createTask(todolistId, title)
      if (data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'))
        return data.data.item
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

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    param: {
      taskId: string
      todolistId: string
      model: UpdateDomainTaskModelType
    },
    { dispatch, getState, rejectWithValue }
  ) => {
    dispatch(setAppStatus('loading'))
    const { taskId, todolistId, model } = param
    const { tasks } = getState() as AppRootStateType
    const task = tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
      return rejectWithValue('task not found in the state')
    }
    const apiModel: UpdateTaskModelType = {
      title: task.title,
      startDate: task.startDate,
      priority: task.priority,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      ...model,
    }
    try {
      const { data } = await todolistAPI.updateTask(
        todolistId,
        taskId,
        apiModel
      )
      if (data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'))
        return param
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

const takskSlice = createSlice({
  name: 'tasks',
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.forEach(tl => {
          state[tl.id] = []
        })
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload]
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const { tasks, todolistId } = action.payload
        state[todolistId] = tasks
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const { taskId, todolistId } = action.payload
        state[todolistId] = state[todolistId].filter(t => t.id !== taskId)
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { taskId, todolistId, model } = action.payload
        const task = state[todolistId].find(t => t.id === taskId)
        if (task) {
          Object.assign(task, model)
        }
      })
  },
})

export const tasksReducer = takskSlice.reducer

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
