import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import AddItemForm from './AddItemForm'
import './App.css'
import Todolist from './Todolist'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {
  changeTodolistFilterAC,
  FilterValuesType,
  TodolistDomainType,
  fetchTodolistsTC,
  removeTodolistTC,
  addTodolistTC,
  changeTodolistTitleTC,
} from './state/todolists-reducer'
import { addTaskTC, removeTaskTC, updateTaskTC } from './state/tasks-reducer'
import { AppDispatch, AppRootStateType } from './state/store'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { TaskStatuses, TaskType } from './api/todolist-api'

export type TasksStateType = {
  [todolistId: string]: TaskType[]
}

function AppWithRedux() {
  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(
    state => state.todolists
  )
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    state => state.tasks
  )

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [dispatch])

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
      dispatch(changeTodolistFilterAC(value, todolistId))
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

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: '20px' }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
          {todolists.map(tl => {
            return (
              <Grid item key={tl.id}>
                <Paper style={{ padding: '10px' }}>
                  <Todolist
                    id={tl.id}
                    title={tl.title}
                    filter={tl.filter}
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
      </Container>
    </div>
  )
}

export default AppWithRedux
