import { ChangeEvent } from 'react'
import AddItemForm from './AddItemForm'
import { FilterValuesType } from './App'
import EditableSpan from './EditableSpan'

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

type PropsType = {
  id: string
  title: string
  filter: FilterValuesType
  tasks: TaskType[]
  addTask: (task: string, todolistId: string) => void
  changeTaskStatus: (
    taskId: string,
    isDone: boolean,
    todolistId: string
  ) => void
  changeTaskTitle: (taskId: string, title: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  changeTodolistTitle: (title: string, todolistId: string) => void
  removeTodolist: (todolistId: string) => void
}

function Todolist(props: PropsType) {
  const tasks = props.tasks.map(t => {
    const onClickHandler = () => props.removeTask(t.id, props.id)
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
    }
    const onChangeTitleHandler = (newValue: string) => {
      props.changeTaskTitle(t.id, newValue, props.id)
    }

    return (
      <li key={t.id} className={t.isDone ? 'is-done' : ''}>
        <input
          type="checkbox"
          checked={t.isDone}
          onChange={onChangeStatusHandler}
        />
        <EditableSpan value={t.title} onChange={onChangeTitleHandler} />{' '}
        <button onClick={onClickHandler}>x</button>
      </li>
    )
  })

  const onAllClickHandler = () => props.changeFilter('all', props.id)
  const onActiveClickHandler = () => props.changeFilter('active', props.id)
  const onCompletedClickHandler = () =>
    props.changeFilter('completed', props.id)

  const removeTodolist = () => {
    props.removeTodolist(props.id)
  }

  const addTask = (title: string) => {
    props.addTask(title, props.id)
  }

  const onChangeHandler = (newTitle: string) => {
    props.changeTodolistTitle(newTitle, props.id)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} onChange={onChangeHandler} />{' '}
        <button onClick={removeTodolist}>x</button>
      </h3>

      <AddItemForm addItem={addTask} />
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
