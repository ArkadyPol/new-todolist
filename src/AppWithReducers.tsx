import { useReducer } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import { v1 } from 'uuid'
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
  todolistsReducer,
} from './state/todolists-reducer'
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from './state/tasks-reducer'

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

export type TasksStateType = {
  [todolistId: string]: TaskType[]
}

function AppWithReducers() {
  const todolistId1 = v1()
  const todolistId2 = v1()

  const [todolists, dispatchToTodolist] = useReducer(todolistsReducer, [
    {
      id: todolistId1,
      title: 'What to learn',
      filter: 'all',
    },
    {
      id: todolistId2,
      title: 'What to buy',
      filter: 'all',
    },
  ])

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    [todolistId1]: [
      { id: v1(), title: 'HTML&CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'React', isDone: false },
      { id: v1(), title: 'Rest API', isDone: false },
      { id: v1(), title: 'GraphQL', isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: 'Milk', isDone: true },
      { id: v1(), title: 'React Book', isDone: true },
      { id: v1(), title: 'Sugar', isDone: true },
      { id: v1(), title: 'Salt', isDone: false },
      { id: v1(), title: 'Flour', isDone: false },
    ],
  })

  function addTask(title: string, todolistId: string) {
    dispatchToTasks(addTaskAC(title, todolistId))
  }

  function changeTaskStatus(
    taskId: string,
    isDone: boolean,
    todolistId: string
  ) {
    dispatchToTasks(changeTaskStatusAC(taskId, isDone, todolistId))
  }

  function changeTaskTitle(taskId: string, title: string, todolistId: string) {
    dispatchToTasks(changeTaskTitleAC(taskId, title, todolistId))
  }

  function removeTask(taskId: string, todolistId: string) {
    dispatchToTasks(removeTaskAC(taskId, todolistId))
  }

  function addTodolist(title: string) {
    const action = addTodolistAC(title)
    dispatchToTodolist(action)
    dispatchToTasks(action)
  }

  function changeFilter(value: FilterValuesType, todolistId: string) {
    dispatchToTodolist(changeTodolistFilterAC(value, todolistId))
  }

  function changeTodolistTitle(title: string, todolistId: string) {
    dispatchToTodolist(changeTodolistTitleAC(title, todolistId))
  }

  function removeTodolist(todolistId: string) {
    const action = removeTodolistAC(todolistId)
    dispatchToTodolist(action)
    dispatchToTasks(action)
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

export default AppWithReducers
