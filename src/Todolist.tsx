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
  filter: FilterValuesType
  removeTask: (id: string) => void
  addTask: (task: string) => void
  changeFilter: (value: FilterValuesType) => void
  changeTaskStatus: (id: string, isDone: boolean) => void
}

function Todolist(props: PropsType) {
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const tasks = props.tasks.map(t => {
    const onClickHandler = () => props.removeTask(t.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      props.changeTaskStatus(t.id, e.currentTarget.checked)
    }

    return (
      <li key={t.id} className={t.isDone ? 'is-done' : ''}>
        <input type="checkbox" checked={t.isDone} onChange={onChangeHandler} />
        <span>{t.title}</span> <button onClick={onClickHandler}>x</button>
      </li>
    )
  })

  const addTask = () => {
    if (title.trim() !== '') {
      props.addTask(title.trim())
      setTitle('')
    } else {
      setError('Title is required!')
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null)
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
          className={error ? 'error' : ''}
        />
        <button onClick={addTask}>+</button>
        {error && <div className="error-message">{error}</div>}
      </div>
      <ul>{tasks}</ul>
      <div>
        <button
          className={props.filter === 'all' ? 'active-filter' : ''}
          onClick={onAllClickHandler}
        >
          All
        </button>
        <button
          className={props.filter === 'active' ? 'active-filter' : ''}
          onClick={onActiveClickHandler}
        >
          Active
        </button>
        <button
          className={props.filter === 'completed' ? 'active-filter' : ''}
          onClick={onCompletedClickHandler}
        >
          Completed
        </button>
      </div>
    </div>
  )
}

export default Todolist
