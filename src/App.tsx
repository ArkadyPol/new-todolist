import { useState } from 'react'
import { v1 } from 'uuid'
import './App.css'
import Todolist, { TaskType } from './Todolist'

export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: v1(), title: 'HTML&CSS', isDone: true },
    { id: v1(), title: 'JS', isDone: true },
    { id: v1(), title: 'React', isDone: false },
    { id: v1(), title: 'Rest API', isDone: false },
    { id: v1(), title: 'GraphQL', isDone: false },
  ])

  const [filter, setFilter] = useState<FilterValuesType>('all')

  function removeTask(id: string) {
    setTasks(tasks.filter(t => t.id !== id))
  }

  function addTask(title: string) {
    let newTask = { id: v1(), title, isDone: false }
    setTasks([newTask, ...tasks])
  }

  function changeFilter(value: FilterValuesType) {
    setFilter(value)
  }

  function changeStatus(id: string, isDone: boolean) {
    setTasks(tasks.map(t => (t.id === id ? { ...t, isDone } : t)))
  }

  let tasksForTodolist = tasks

  if (filter === 'active') {
    tasksForTodolist = tasks.filter(t => !t.isDone)
  }

  if (filter === 'completed') {
    tasksForTodolist = tasks.filter(t => t.isDone)
  }

  return (
    <div className="App">
      <Todolist
        title={'What to learn'}
        tasks={tasksForTodolist}
        removeTask={removeTask}
        changeFilter={changeFilter}
        changeTaskStatus={changeStatus}
        addTask={addTask}
        filter={filter}
      />
    </div>
  )
}

export default App
