import { forwardRef, SyntheticEvent } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { AppRootStateType, useAppDispatch } from '../../app/store'
import { useSelector } from 'react-redux'
import { setAppError } from '../../app/app-reducer'

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert ref={ref} elevation={6} variant="filled" {...props} />
})

const ErrorSnackbar = () => {
  const error = useSelector<AppRootStateType, string | null>(
    state => state.app.error
  )
  const dispatch = useAppDispatch()

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(setAppError(null))
  }

  return (
    <Snackbar
      open={error !== null}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  )
}

export default ErrorSnackbar
