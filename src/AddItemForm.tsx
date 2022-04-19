import { ChangeEvent, KeyboardEvent, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import AddBox from '@material-ui/icons/AddBox'

type PropsType = {
  addItem: (title: string) => void
}

function AddItemForm(props: PropsType) {
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const addItem = () => {
    if (title.trim() !== '') {
      props.addItem(title.trim())
      setTitle('')
    } else {
      setError('Title is required!')
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null)
    if (e.key === 'Enter') addItem()
  }

  return (
    <div>
      <TextField
        variant="outlined"
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        label="Title"
        helperText={error}
      />
      <IconButton color="primary" onClick={addItem}>
        <AddBox />
      </IconButton>
    </div>
  )
}

export default AddItemForm
