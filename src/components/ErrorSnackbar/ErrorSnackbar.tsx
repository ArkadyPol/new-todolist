import { forwardRef, SyntheticEvent } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { AppDispatch, AppRootStateType } from '../../app/store'
import { useDispatch, useSelector } from 'react-redux'
import { setAppErrorAC } from '../../app/app-reducer'

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert ref={ref} elevation={6} variant="filled" {...props} />
})

const ErrorSnackbar = () => {
  const error = useSelector<AppRootStateType, string | null>(
    state => state.app.error
  )
  const dispatch = useDispatch<AppDispatch>()

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(setAppErrorAC(null))
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
