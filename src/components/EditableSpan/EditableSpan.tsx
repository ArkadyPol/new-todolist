import { memo, useState } from 'react'
import TextField from '@mui/material/TextField'

type PropsType = {
  value: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

const EditableSpan = memo<PropsType>(
  ({ value, onChange, disabled = false }) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(value)

    const activateEditMode = () => {
      if (!disabled) {
        setEditMode(true)
        setTitle(value)
      }
    }

    const activateViewMode = () => {
      setEditMode(false)
      onChange(title)
    }

    return editMode ? (
      <TextField
        variant="outlined"
        value={title}
        autoFocus
        onBlur={activateViewMode}
        onChange={e => setTitle(e.currentTarget.value)}
      />
    ) : (
      <span onDoubleClick={activateEditMode}>{value}</span>
    )
  }
)

export default EditableSpan
