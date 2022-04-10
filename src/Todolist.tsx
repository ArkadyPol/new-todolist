type TaskType = {
  id: number
  title: string
  isDone: boolean
}

type PropsType = {
  title: string
  tasks: TaskType[]
}

function Todolist(props: PropsType) {
  let tasks = props.tasks.map(t => (
    <li key={t.id}>
      <input type="checkbox" checked={t.isDone} /> <span>{t.title}</span>
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
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
      </div>
    </div>
  )
}

export default Todolist
