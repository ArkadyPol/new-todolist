import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import EditableSpan from '../EditableSpan'

export default {
  title: 'Todolist/EditableSpan',
  component: EditableSpan,
} as ComponentMeta<typeof EditableSpan>

const Template: ComponentStory<typeof EditableSpan> = args => (
  <EditableSpan {...args} />
)

export const EditableSpanExample = Template.bind({})
EditableSpanExample.args = {
  value: 'HTML',
  onChange: action('value changed'),
}
