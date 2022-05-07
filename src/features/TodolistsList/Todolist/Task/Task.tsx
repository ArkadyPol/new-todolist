import { ChangeEvent, memo, useCallback } from 'react'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import EditableSpan from '../../../../components/EditableSpan/EditableSpan'
import { TaskStatuses, TaskType } from '../../../../api/todolist-api'

type PropsType = {
  task: TaskType
  todolistId: string
  removeTask: (taskId: string, todolistId: string) => void
  changeTaskStatus: (
    taskId: string,
    status: TaskStatuses,
    todolistId: string
  ) => void
  changeTaskTitle: (taskId: string, title: string, todolistId: string) => void
}

const Task = memo<PropsType>(props => {
  const { todolistId, changeTaskTitle, removeTask, changeTaskStatus } = props
  const { id: taskId, status, title } = props.task
  const onClickHandler = () => removeTask(taskId, todolistId)
  const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    changeTaskStatus(
      taskId,
      e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New,
      todolistId
    )
  }
  const onChangeTitleHandler = useCallback(
    (newValue: string) => {
      changeTaskTitle(taskId, newValue, todolistId)
    },
    [changeTaskTitle, taskId, todolistId]
  )

  return (
    <div>
      <Checkbox
        color="primary"
        checked={status === TaskStatuses.Completed}
        onChange={onChangeStatusHandler}
      />
      <EditableSpan value={title} onChange={onChangeTitleHandler} />{' '}
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  )
})

export default Task
