import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import { memo, useCallback, useEffect } from 'react'
import AddItemForm from '../../../components/AddItemForm/AddItemForm'
import { TaskStatuses, TaskType } from '../../../api/todolist-api'
import EditableSpan from '../../../components/EditableSpan/EditableSpan'
import { useAppDispatch } from '../../../app/store'
import { fetchTasksTC } from '../tasks-reducer'
import { FilterValuesType, TodolistDomainType } from '../todolists-reducer'
import Task from './Task/Task'

type PropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
  addTask: (task: string, todolistId: string) => void
  changeTaskStatus: (
    taskId: string,
    status: TaskStatuses,
    todolistId: string
  ) => void
  changeTaskTitle: (taskId: string, title: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  changeTodolistTitle: (title: string, todolistId: string) => void
  removeTodolist: (todolistId: string) => void
}

const Todolist = memo<PropsType>(props => {
  const {
    addTask,
    changeFilter,
    changeTodolistTitle,
    changeTaskStatus,
    changeTaskTitle,
    removeTask,
    removeTodolist,
    tasks,
  } = props
  const { id, entityStatus, filter, title } = props.todolist

  const dispacth = useAppDispatch()

  useEffect(() => {
    dispacth(fetchTasksTC(id))
  }, [dispacth, id])

  let tasksForTodolist = tasks

  if (filter === 'active') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
  }

  if (filter === 'completed') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
  }

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
        <EditableSpan
          value={title}
          onChange={onChangeHandler}
          disabled={entityStatus === 'loading'}
        />{' '}
        <IconButton
          onClick={() => removeTodolist(id)}
          disabled={entityStatus === 'loading'}
        >
          <Delete />
        </IconButton>
      </h3>

      <AddItemForm addItem={addItem} disabled={entityStatus === 'loading'} />
      <div>
        {tasksForTodolist.map(t => (
          <Task
            key={t.id}
            task={t}
            todolistId={id}
            removeTask={removeTask}
            changeTaskStatus={changeTaskStatus}
            changeTaskTitle={changeTaskTitle}
          />
        ))}
      </div>
      <div>
        <Button
          variant={filter === 'all' ? 'outlined' : 'text'}
          onClick={onAllClickHandler}
          color="inherit"
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'outlined' : 'text'}
          onClick={onActiveClickHandler}
          color="primary"
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'outlined' : 'text'}
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
