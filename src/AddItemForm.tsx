import { ChangeEvent, KeyboardEvent, useState } from 'react'

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
      <input
        value={title}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        className={error ? 'error' : ''}
      />
      <button onClick={addItem}>+</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default AddItemForm
