import { FilterValuesType } from './App'

export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

type PropsType = {
  title: string
  tasks: TaskType[]
  removeTask: (id: number) => void
  changeFilter: (value: FilterValuesType) => void
}

function Todolist(props: PropsType) {
  let tasks = props.tasks.map(t => (
    <li key={t.id}>
      <input type="checkbox" checked={t.isDone} />
      <span>{t.title}</span>{' '}
      <button
        onClick={() => {
          props.removeTask(t.id)
        }}
      >
        x
      </button>
    </li>
  ))

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input />
        <button>+</button>
      </div>
      <ul>{tasks}</ul>
      <div>
        <button onClick={() => props.changeFilter('all')}>All</button>
        <button onClick={() => props.changeFilter('active')}>Active</button>
        <button onClick={() => props.changeFilter('completed')}>
          Completed
        </button>
      </div>
    </div>
  )
}

export default Todolist
