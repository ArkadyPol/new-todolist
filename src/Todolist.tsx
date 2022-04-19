import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
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
      <div key={t.id} className={t.isDone ? 'is-done' : ''}>
        <Checkbox
          color="primary"
          checked={t.isDone}
          onChange={onChangeStatusHandler}
        />
        <EditableSpan value={t.title} onChange={onChangeTitleHandler} />{' '}
        <IconButton onClick={onClickHandler}>
          <Delete />
        </IconButton>
      </div>
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
        <IconButton onClick={removeTodolist}>
          <Delete />
        </IconButton>
      </h3>

      <AddItemForm addItem={addTask} />
      <div>{tasks}</div>
      <div>
        <Button
          variant={props.filter === 'all' ? 'outlined' : 'text'}
          onClick={onAllClickHandler}
        >
          All
        </Button>
        <Button
          variant={props.filter === 'active' ? 'outlined' : 'text'}
          onClick={onActiveClickHandler}
          color="primary"
        >
          Active
        </Button>
        <Button
          variant={props.filter === 'completed' ? 'outlined' : 'text'}
          onClick={onCompletedClickHandler}
          color="secondary"
        >
          Completed
        </Button>
      </div>
    </div>
  )
}

export default Todolist
