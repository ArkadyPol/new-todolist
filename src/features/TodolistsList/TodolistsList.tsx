import AddItemForm from '../../components/AddItemForm/AddItemForm'
import Todolist from './Todolist/Todolist'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import {
  changeTodolistFilter,
  FilterValuesType,
  TodolistDomainType,
  fetchTodolistsTC,
  removeTodolistTC,
  addTodolistTC,
  changeTodolistTitleTC,
} from './todolists-reducer'
import {
  addTaskTC,
  removeTaskTC,
  TasksStateType,
  updateTaskTC,
} from './tasks-reducer'
import { AppRootStateType, useAppDispatch } from '../../app/store'
import { TaskStatuses } from '../../api/todolist-api'

export function TodolistsList() {
  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(
    state => state.todolists
  )
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    state => state.tasks
  )
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    state => state.auth.isLoggedIn
  )

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoggedIn) return
    dispatch(fetchTodolistsTC())
  }, [dispatch, isLoggedIn])

  const addTask = useCallback(
    (title: string, todolistId: string) => {
      dispatch(addTaskTC(title, todolistId))
    },
    [dispatch]
  )

  const changeTaskStatus = useCallback(
    (taskId: string, status: TaskStatuses, todolistId: string) => {
      dispatch(updateTaskTC(taskId, todolistId, { status }))
    },
    [dispatch]
  )

  const changeTaskTitle = useCallback(
    (taskId: string, title: string, todolistId: string) => {
      dispatch(updateTaskTC(taskId, todolistId, { title }))
    },
    [dispatch]
  )

  const removeTask = useCallback(
    (taskId: string, todolistId: string) => {
      dispatch(removeTaskTC(taskId, todolistId))
    },
    [dispatch]
  )

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title))
    },
    [dispatch]
  )

  const changeFilter = useCallback(
    (value: FilterValuesType, todolistId: string) => {
      dispatch(changeTodolistFilter({ id: todolistId, filter: value }))
    },
    [dispatch]
  )

  const changeTodolistTitle = useCallback(
    (title: string, todolistId: string) => {
      dispatch(changeTodolistTitleTC(todolistId, title))
    },
    [dispatch]
  )

  const removeTodolist = useCallback(
    (todolistId: string) => {
      dispatch(removeTodolistTC(todolistId))
    },
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map(tl => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '10px' }}>
                <Todolist
                  todolist={tl}
                  tasks={tasks[tl.id]}
                  addTask={addTask}
                  changeTaskStatus={changeTaskStatus}
                  changeTaskTitle={changeTaskTitle}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  changeTodolistTitle={changeTodolistTitle}
                  removeTodolist={removeTodolist}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
