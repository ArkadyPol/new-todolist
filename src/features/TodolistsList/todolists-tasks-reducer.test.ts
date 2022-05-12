import { TodolistType } from '../../api/todolist-api'
import { tasksReducer, TasksStateType } from './tasks-reducer'
import {
  addTodolist,
  TodolistDomainType,
  todolistsReducer,
} from './todolists-reducer'

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  const newTodolist: TodolistType = {
    id: 'todolistId1',
    title: 'New Todolist',
    addedDate: '',
    order: 0,
  }

  const action = addTodolist.fulfilled(newTodolist, 'requestId', 'New Todolist')

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.id)
  expect(idFromTodolists).toBe(action.payload.id)
})
