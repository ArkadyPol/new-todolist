import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import { memo, useCallback } from 'react'
import AddItemForm from './AddItemForm'
import { FilterValuesType } from './App'
import EditableSpan from './EditableSpan'
import Task from './Task'

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

const Todolist = memo((props: PropsType) => {
  const { id, addTask, changeFilter, changeTodolistTitle } = props
  console.log('Todolist called')
  let tasksForTodolist = props.tasks

  if (props.filter === 'active') {
    tasksForTodolist = props.tasks.filter(t => !t.isDone)
  }

  if (props.filter === 'completed') {
    tasksForTodolist = props.tasks.filter(t => t.isDone)
  }

  const tasks = tasksForTodolist.map(t => (
    <Task
      key={t.id}
      isDone={t.isDone}
      title={t.title}
      taskId={t.id}
      todolistId={id}
      removeTask={props.removeTask}
      changeTaskStatus={props.changeTaskStatus}
      changeTaskTitle={props.changeTaskTitle}
    />
  ))

  const onAllClickHandler = useCallback(
    () => changeFilter('all', id),
    [changeFilter, id]
  )
  const onActiveClickHandler = useCallback(
    () => changeFilter('active', id),
    [changeFilter, id]
  )
  const onCompletedClickHandler = useCallback(
    () => changeFilter('completed', id),
    [changeFilter, id]
  )

  const removeTodolist = () => {
    props.removeTodolist(id)
  }

  const addItem = useCallback(
    (title: string) => {
      addTask(title, id)
    },
    [addTask, id]
  )

  const onChangeHandler = useCallback(
    (newTitle: string) => {
      changeTodolistTitle(newTitle, id)
    },
    [changeTodolistTitle, id]
  )

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} onChange={onChangeHandler} />{' '}
        <IconButton onClick={removeTodolist}>
          <Delete />
        </IconButton>
      </h3>

      <AddItemForm addItem={addItem} />
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
})

export default Todolist
