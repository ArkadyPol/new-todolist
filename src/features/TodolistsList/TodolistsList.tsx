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
  fetchTodolists,
  removeTodolist,
  changeTodolistTitle,
  addTodolist,
} from './todolists-reducer'
import {
  addTask,
  removeTask,
  TasksStateType,
  updateTask,
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
    dispatch(fetchTodolists())
  }, [dispatch, isLoggedIn])

  const addTaskHandler = useCallback(
    (title: string, todolistId: string) => {
      dispatch(addTask({ title, todolistId }))
    },
    [dispatch]
  )

  const changeTaskStatus = useCallback(
    (taskId: string, status: TaskStatuses, todolistId: string) => {
      dispatch(updateTask({ taskId, todolistId, model: { status } }))
    },
    [dispatch]
  )

  const changeTaskTitle = useCallback(
    (taskId: string, title: string, todolistId: string) => {
      dispatch(updateTask({ taskId, todolistId, model: { title } }))
    },
    [dispatch]
  )

  const removeTaskHandler = useCallback(
    (taskId: string, todolistId: string) => {
      dispatch(removeTask({ taskId, todolistId }))
    },
    [dispatch]
  )

  const addTodolistHandler = useCallback(
    (title: string) => {
      dispatch(addTodolist(title))
    },
    [dispatch]
  )

  const changeFilter = useCallback(
    (value: FilterValuesType, todolistId: string) => {
      dispatch(changeTodolistFilter({ id: todolistId, filter: value }))
    },
    [dispatch]
  )

  const changeTodolistTitleHandler = useCallback(
    (title: string, id: string) => {
      dispatch(changeTodolistTitle({ id, title }))
    },
    [dispatch]
  )

  const removeTodolistHandler = useCallback(
    (todolistId: string) => {
      dispatch(removeTodolist(todolistId))
    },
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map(tl => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '10px' }}>
                <Todolist
                  todolist={tl}
                  tasks={tasks[tl.id]}
                  addTask={addTaskHandler}
                  changeTaskStatus={changeTaskStatus}
                  changeTaskTitle={changeTaskTitle}
                  removeTask={removeTaskHandler}
                  changeFilter={changeFilter}
                  changeTodolistTitle={changeTodolistTitleHandler}
                  removeTodolist={removeTodolistHandler}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
