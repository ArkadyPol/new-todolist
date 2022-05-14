import { ChangeEvent, memo } from 'react'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import EditableSpan from '../../../../components/EditableSpan/EditableSpan'
import { TaskStatuses, TaskType } from '../../../../api/todolist-api'
import { useAppDispatch } from '../../../../app/store'
import { removeTask, updateTask } from '../../tasks-reducer'

type PropsType = {
  task: TaskType
}

const Task = memo<PropsType>(props => {
  const { id: taskId, status, title, todoListId: todolistId } = props.task
  const dispatch = useAppDispatch()

  const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked
      ? TaskStatuses.Completed
      : TaskStatuses.New
    dispatch(updateTask({ taskId, todolistId, model: { status } }))
  }

  return (
    <div>
      <Checkbox
        color="primary"
        checked={status === TaskStatuses.Completed}
        onChange={onChangeStatusHandler}
      />
      <EditableSpan
        value={title}
        onChange={title =>
          dispatch(updateTask({ taskId, todolistId, model: { title } }))
        }
      />{' '}
      <IconButton onClick={() => dispatch(removeTask({ taskId, todolistId }))}>
        <Delete />
      </IconButton>
    </div>
  )
})

export default Task
