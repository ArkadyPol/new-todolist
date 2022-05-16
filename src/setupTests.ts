import mockAxios from 'axios'
import {
  GetTasksResponse,
  ResponseType,
  TaskPriorities,
  TaskStatuses,
  TodolistType,
  UserType,
} from './api/todolist-api'
import { delay } from './utils/timer-utils'

beforeEach(() => {
  ;(mockAxios.get as jest.Mock) = jest.fn((url: string) => {
    let data = {}
    if (url === 'auth/me') {
      const currentData: ResponseType<UserType> = {
        data: { id: 1, login: 'test', email: 'test@gmail.com' },
        messages: [],
        fieldsErrors: [],
        resultCode: 0,
      }
      data = currentData
    }
    if (url === 'todo-lists') {
      const currentData: TodolistType[] = [
        {
          id: '1',
          title: 'What to learn',
          addedDate: '',
          order: 0,
        },
        {
          id: '2',
          title: 'What to buy',
          addedDate: '',
          order: 0,
        },
        {
          id: '3',
          title: 'Movies',
          addedDate: '',
          order: 0,
        },
      ]

      data = currentData
    }
    if (url === 'todo-lists') {
      const currentData: TodolistType[] = [
        {
          id: '1',
          title: 'What to learn',
          addedDate: '',
          order: 0,
        },
        {
          id: '2',
          title: 'What to buy',
          addedDate: '',
          order: 0,
        },
      ]

      data = currentData
    }

    if (url === 'todo-lists/1/tasks') {
      const currentData: GetTasksResponse = {
        items: [
          {
            id: '1',
            title: 'CSS',
            status: TaskStatuses.New,
            todoListId: '1',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: '',
          },
          {
            id: '2',
            title: 'JS',
            status: TaskStatuses.Completed,
            todoListId: '1',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: '',
          },
          {
            id: '3',
            title: 'React',
            status: TaskStatuses.New,
            todoListId: '1',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: '',
          },
        ],
        totalCount: 3,
        error: null,
      }

      data = currentData
    }

    if (url === 'todo-lists/2/tasks') {
      const currentData: GetTasksResponse = {
        items: [
          {
            id: '1',
            title: 'bread',
            status: TaskStatuses.New,
            todoListId: '2',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: '',
          },
          {
            id: '2',
            title: 'milk',
            status: TaskStatuses.Completed,
            todoListId: '2',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: '',
          },
          {
            id: '3',
            title: 'tea',
            status: TaskStatuses.New,
            todoListId: '2',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            description: '',
          },
        ],
        totalCount: 3,
        error: null,
      }

      data = currentData
    }

    return delay({ data: data }, 10)
  })
})
