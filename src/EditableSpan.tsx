import { ChangeEvent, useState } from 'react'

type PropsType = {
  value: string
  onChange: (newValue: string) => void
}

function EditableSpan(props: PropsType) {
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
    <input
      value={title}
      autoFocus
      onBlur={activateViewMode}
      onChange={onChangeHandler}
    />
  ) : (
    <span onDoubleClick={activateEditMode}>{props.value}</span>
  )
}

export default EditableSpan
