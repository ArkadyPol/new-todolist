import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '5b45db92-1873-413b-b381-8ca3c90f1dc1',
  },
})

const todolistAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>('todo-lists')
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {
      title,
    })
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${id}`, {
      title,
    })
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistId}/tasks`,
      {
        title,
      }
    )
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(
      `todo-lists/${todolistId}/tasks/${taskId}`
    )
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      model
    )
  },
}

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
  },
  me() {
    return instance.get<ResponseType<UserType>>('auth/me')
  },
  logout() {
    return instance.delete<ResponseType>('auth/login')
  },
}

export type UserType = {
  id: number
  email: string
  login: string
}
export type GetTasksResponse = {
  items: TaskType[]
  totalCount: number
  error: string | null
}
export type FieldErrorType = {
  field: string
  error: string
}
export type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  fieldsErrors: Array<FieldErrorType>
  data: D
}
export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  High = 2,
  Urgently = 3,
  Later = 4,
}
export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: number
  priority: number
  startDate: string
  deadline: string
}
export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export default todolistAPI
