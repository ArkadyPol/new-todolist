import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Menu from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'
import { useAppDispatch, AppRootStateType } from './store'
import { initializeAppTC, RequestStatusType } from './app-reducer'
import ErrorSnackbar from '../components/ErrorSnackbar/ErrorSnackbar'
import { Login } from '../features/Login/Login'
import { logoutTC } from '../features/Login/auth-reducer'

function App() {
  const status = useSelector<AppRootStateType, RequestStatusType>(
    state => state.app.status
  )
  const isInitialized = useSelector<AppRootStateType, boolean>(
    state => state.app.isInitialized
  )
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    state => state.auth.isLoggedIn
  )
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [dispatch])

  const logoutHandler = useCallback(() => {
    dispatch(logoutTC())
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '30%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress color="secondary" />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path="/" element={<TodolistsList />} />
          <Route path="login" element={<Login />} />
          <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path="*" element={<Navigate to={'/404'} />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
