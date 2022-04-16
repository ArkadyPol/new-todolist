import { useState } from 'react'
import { v1 } from 'uuid'
import './App.css'
import Todolist, { TaskType } from './Todolist'

export type FilterValuesType = 'all' | 'active' | 'completed'
type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

type TaskStateType = {
  [todolistId: string]: TaskType[]
}

function App() {
  const todolistId1 = v1()
  const todolistId2 = v1()

  const [todolists, setTodolists] = useState<TodolistType[]>([
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

  const [tasks, setTasks] = useState<TaskStateType>({
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

  function removeTask(taskId: string, todolistId: string) {
    setTasks({
      ...tasks,
      [todolistId]: tasks[todolistId].filter(t => t.id !== taskId),
    })
  }

  function addTask(title: string, todolistId: string) {
    const newTask = { id: v1(), title, isDone: false }
    setTasks({
      ...tasks,
      [todolistId]: [newTask, ...tasks[todolistId]],
    })
  }

  function changeFilter(value: FilterValuesType, todolistId: string) {
    setTodolists(
      todolists.map(tl =>
        tl.id === todolistId ? { ...tl, filter: value } : tl
      )
    )
  }

  function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
    setTasks({
      ...tasks,
      [todolistId]: tasks[todolistId].map(t =>
        t.id === taskId ? { ...t, isDone } : t
      ),
    })
  }

  function removeTodolist(todolistId: string) {
    setTodolists(todolists.filter(tl => tl.id !== todolistId))
    const copyTasks = { ...tasks }
    delete copyTasks[todolistId]
    setTasks(copyTasks)
  }

  return (
    <div className="App">
      {todolists.map(tl => {
        let tasksForTodolist = tasks[tl.id]

        if (tl.filter === 'active') {
          tasksForTodolist = tasks[tl.id].filter(t => !t.isDone)
        }

        if (tl.filter === 'completed') {
          tasksForTodolist = tasks[tl.id].filter(t => t.isDone)
        }

        return (
          <Todolist
            key={tl.id}
            id={tl.id}
            title={tl.title}
            tasks={tasksForTodolist}
            removeTask={removeTask}
            changeFilter={changeFilter}
            changeTaskStatus={changeStatus}
            addTask={addTask}
            filter={tl.filter}
            removeTodolist={removeTodolist}
          />
        )
      })}
    </div>
  )
}

export default App
