import { ChangeEvent, memo, useState } from 'react'
import TextField from '@material-ui/core/TextField'

type PropsType = {
  value: string
  onChange: (newValue: string) => void
}

const EditableSpan = memo((props: PropsType) => {
  console.log('EditableSpan called')
  const [editMode, setEditMode] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.value)

  const activateEditMode = () => setEditMode(true)

  const activateViewMode = () => {
    setEditMode(false)
    props.onChange(title)
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return editMode ? (
    <TextField
      variant="outlined"
      value={title}
      autoFocus
      onBlur={activateViewMode}
      onChange={onChangeHandler}
    />
  ) : (
    <span onDoubleClick={activateEditMode}>{props.value}</span>
  )
})

export default EditableSpan
