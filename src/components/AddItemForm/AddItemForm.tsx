import { KeyboardEvent, memo, useState } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import AddBox from '@mui/icons-material/AddBox'

type PropsType = {
  addItem: (title: string) => void
  disabled?: boolean
}

const AddItemForm = memo<PropsType>(({ addItem, disabled = false }) => {
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const addItemkHandler = () => {
    if (title.trim() !== '') {
      addItem(title.trim())
      setTitle('')
    } else {
      setError('Title is required!')
    }
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.key === 'Enter') addItemkHandler()
  }

  return (
    <div>
      <TextField
        disabled={disabled}
        variant="outlined"
        error={!!error}
        value={title}
        onChange={e => setTitle(e.currentTarget.value)}
        onKeyDown={onKeyDownHandler}
        label="Title"
        helperText={error}
      />
      <IconButton color="primary" onClick={addItemkHandler} disabled={disabled}>
        <AddBox />
      </IconButton>
    </div>
  )
})

export default AddItemForm
