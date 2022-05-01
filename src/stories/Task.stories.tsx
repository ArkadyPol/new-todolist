import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Task from '../Task'
import { TaskStatuses } from '../api/todolist-api'

export default {
  title: 'Todolist/Task',
  component: Task,
  args: {
    removeTask: action('Task removed'),
    changeTaskStatus: action('Task status changed '),
    changeTaskTitle: action('Task title changed '),
  },
} as ComponentMeta<typeof Task>

const Template: ComponentStory<typeof Task> = args => <Task {...args} />

export const TaskIsDoneExample = Template.bind({})
TaskIsDoneExample.args = {
  taskId: '1',
  status: TaskStatuses.Completed,
  title: 'JS',
  todolistId: 'todolistId1',
}

export const TaskIsNotDoneExample = Template.bind({})
TaskIsNotDoneExample.args = {
  taskId: '1',
  status: TaskStatuses.New,
  title: 'HTML&CSS',
  todolistId: 'todolistId1',
}
