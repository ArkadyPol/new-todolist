import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { FilterValuesType } from './App'

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

type PropsType = {
  title: string
  tasks: TaskType[]
  removeTask: (id: string) => void
  addTask: (task: string) => void
  changeFilter: (value: FilterValuesType) => void
}

function Todolist(props: PropsType) {
  const [title, setTitle] = useState<string>('')

  const tasks = props.tasks.map(t => {
    const onClickHandler = () => props.removeTask(t.id)

    return (
      <li key={t.id}>
        <input type="checkbox" checked={t.isDone} />
        <span>{t.title}</span> <button onClick={onClickHandler}>x</button>
      </li>
    )
  })

  const addTask = () => {
    props.addTask(title)
    setTitle('')
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addTask()
  }

  const onAllClickHandler = () => props.changeFilter('all')
  const onActiveClickHandler = () => props.changeFilter('active')
  const onCompletedClickHandler = () => props.changeFilter('completed')

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={title}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
        />
        <button onClick={addTask}>+</button>
      </div>
      <ul>{tasks}</ul>
      <div>
        <button onClick={onAllClickHandler}>All</button>
        <button onClick={onActiveClickHandler}>Active</button>
        <button onClick={onCompletedClickHandler}>Completed</button>
      </div>
    </div>
  )
}

export default Todolist
