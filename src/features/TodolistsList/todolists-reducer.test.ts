import {
  addTodolist,
  changeTodolistEntityStatus,
  changeTodolistFilter,
  changeTodolistTitle,
  FilterValuesType,
  removeTodolist,
  fetchTodolists,
  TodolistDomainType,
  todolistsReducer,
} from './todolists-reducer'
import { TodolistType } from '../../api/todolist-api'
import { RequestStatusType } from '../../app/app-reducer'

let todolistId1: string
let todolistId2: string
let startState: TodolistDomainType[] = []

beforeEach(() => {
  todolistId1 = '1'
  todolistId2 = '2'
  startState = [
    {
      id: todolistId1,
      title: 'What to learn',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
    {
      id: todolistId2,
      title: 'What to buy',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
  ]
})

test('correct todolist should be removed', () => {
  const action = removeTodolist.fulfilled(todolistId1, 'requestId', todolistId1)

  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
  const newTodolist: TodolistType = {
    id: todolistId1,
    title: 'New Todolist',
    addedDate: '',
    order: 0,
  }

  const action = addTodolist.fulfilled(
    newTodolist,
    'requestId',
    newTodolist.title
  )

  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolist.title)
  expect(endState[0].filter).toBe('all')
  expect(endState[0].entityStatus).toBe('idle')
})

test('correct todolist should change its name', () => {
  const newTodolistTitle = 'New Todolist'
  const param = { id: todolistId2, title: newTodolistTitle }

  const action = changeTodolistTitle.fulfilled(param, 'requestId', param)

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = 'completed'

  const endState = todolistsReducer(
    startState,
    changeTodolistFilter({ id: todolistId2, filter: newFilter })
  )

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})

test('todolists should be set to the state', () => {
  const startState: TodolistType[] = [
    {
      id: todolistId1,
      title: 'What to learn',
      addedDate: '',
      order: 0,
    },
    {
      id: todolistId2,
      title: 'What to buy',
      addedDate: '',
      order: 0,
    },
  ]

  const action = fetchTodolists.fulfilled(startState, 'requestId')

  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
  expect(endState[0].filter).toBe('all')
  expect(endState[0].entityStatus).toBe('idle')
})

test('correct entity status of todolist should be changed', () => {
  let newStatus: RequestStatusType = 'loading'

  const endState = todolistsReducer(
    startState,
    changeTodolistEntityStatus({ id: todolistId2, status: newStatus })
  )

  expect(endState[0].entityStatus).toBe('idle')
  expect(endState[1].entityStatus).toBe(newStatus)
})
