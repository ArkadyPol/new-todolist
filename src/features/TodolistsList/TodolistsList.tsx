import AddItemForm from '../../components/AddItemForm/AddItemForm'
import Todolist from './Todolist/Todolist'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Navigate } from 'react-router-dom'
import { addTodolist } from './todolists-reducer'
import { useAppSelector, useAppDispatch } from '../../app/store'

export function TodolistsList() {
  const todolists = useAppSelector(state => state.todolists)
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

  const dispatch = useAppDispatch()

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={title => dispatch(addTodolist(title))} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map(tl => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '10px' }}>
                <Todolist todolist={tl} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
