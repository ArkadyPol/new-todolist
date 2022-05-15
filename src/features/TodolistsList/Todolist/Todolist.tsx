import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import { memo } from 'react'
import AddItemForm from '../../../components/AddItemForm/AddItemForm'
import { TaskStatuses } from '../../../api/todolist-api'
import EditableSpan from '../../../components/EditableSpan/EditableSpan'
import {
  changeTodolistFilter,
  changeTodolistTitle,
  removeTodolist,
  TodolistDomainType,
} from '../todolists-reducer'
import Task from './Task/Task'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { addTask } from '../tasks-reducer'

type PropsType = {
  todolist: TodolistDomainType
}

const Todolist = memo<PropsType>(props => {
  const { id, entityStatus, filter, title } = props.todolist
  const tasks = useAppSelector(state => state.tasks)[id]

  const dispatch = useAppDispatch()

  let tasksForTodolist = tasks

  if (filter === 'active') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
  }

  if (filter === 'completed') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan
          value={title}
          onChange={title => dispatch(changeTodolistTitle({ title, id }))}
          disabled={entityStatus === 'loading'}
        />{' '}
        <IconButton
          onClick={() => dispatch(removeTodolist(id))}
          disabled={entityStatus === 'loading'}
        >
          <Delete />
        </IconButton>
      </h3>

      <AddItemForm
        addItem={title => dispatch(addTask({ title, todolistId: id }))}
        disabled={entityStatus === 'loading'}
      />
      <div>
        {tasksForTodolist.map(t => (
          <Task key={t.id} task={t} />
        ))}
      </div>
      <div>
        <Button
          variant={filter === 'all' ? 'outlined' : 'text'}
          onClick={() => dispatch(changeTodolistFilter({ id, filter: 'all' }))}
          color="inherit"
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'outlined' : 'text'}
          onClick={() =>
            dispatch(changeTodolistFilter({ id, filter: 'active' }))
          }
          color="primary"
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'outlined' : 'text'}
          onClick={() =>
            dispatch(changeTodolistFilter({ id, filter: 'completed' }))
          }
          color="secondary"
        >
          Completed
        </Button>
      </div>
    </div>
  )
})

export default Todolist
