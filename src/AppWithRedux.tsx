import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import AddItemForm from './AddItemForm'
import './App.css'
import Todolist, { TaskType } from './Todolist'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
} from './state/todolists-reducer'
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from './state/tasks-reducer'
import { AppRootStateType } from './state/store'
import { useDispatch, useSelector } from 'react-redux'

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

export type TasksStateType = {
  [todolistId: string]: TaskType[]
}

function AppWithRedux() {
  const todolists = useSelector<AppRootStateType, TodolistType[]>(
    state => state.todolists
  )
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    state => state.tasks
  )
  const dispatch = useDispatch()

  function addTask(title: string, todolistId: string) {
    dispatch(addTaskAC(title, todolistId))
  }

  function changeTaskStatus(
    taskId: string,
    isDone: boolean,
    todolistId: string
  ) {
    dispatch(changeTaskStatusAC(taskId, isDone, todolistId))
  }

  function changeTaskTitle(taskId: string, title: string, todolistId: string) {
    dispatch(changeTaskTitleAC(taskId, title, todolistId))
  }

  function removeTask(taskId: string, todolistId: string) {
    dispatch(removeTaskAC(taskId, todolistId))
  }

  function addTodolist(title: string) {
    dispatch(addTodolistAC(title))
  }

  function changeFilter(value: FilterValuesType, todolistId: string) {
    dispatch(changeTodolistFilterAC(value, todolistId))
  }

  function changeTodolistTitle(title: string, todolistId: string) {
    dispatch(changeTodolistTitleAC(title, todolistId))
  }

  function removeTodolist(todolistId: string) {
    dispatch(removeTodolistAC(todolistId))
  }

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
            let tasksForTodolist = tasks[tl.id]

            if (tl.filter === 'active') {
              tasksForTodolist = tasks[tl.id].filter(t => !t.isDone)
            }

            if (tl.filter === 'completed') {
              tasksForTodolist = tasks[tl.id].filter(t => t.isDone)
            }

            return (
              <Grid item key={tl.id}>
                <Paper style={{ padding: '10px' }}>
                  <Todolist
                    id={tl.id}
                    title={tl.title}
                    filter={tl.filter}
                    tasks={tasksForTodolist}
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