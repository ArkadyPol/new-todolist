import { ChangeEvent, memo, useCallback } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import EditableSpan from './EditableSpan'
import { TaskStatuses } from './api/todolist-api'

type PropsType = {
  status: TaskStatuses
  title: string
  taskId: string
  todolistId: string
  removeTask: (taskId: string, todolistId: string) => void
  changeTaskStatus: (
    taskId: string,
    status: TaskStatuses,
    todolistId: string
  ) => void
  changeTaskTitle: (taskId: string, title: string, todolistId: string) => void
}

const Task = memo((props: PropsType) => {
  const { taskId, todolistId, changeTaskTitle } = props
  const onClickHandler = () => props.removeTask(taskId, todolistId)
  const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    props.changeTaskStatus(
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
    <div className={props.status === TaskStatuses.Completed ? 'is-done' : ''}>
      <Checkbox
        color="primary"
        checked={props.status === TaskStatuses.Completed}
        onChange={onChangeStatusHandler}
      />
      <EditableSpan value={props.title} onChange={onChangeTitleHandler} />{' '}
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  )
})

export default Task
