import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import { Navigate } from 'react-router-dom'
import { login } from './auth-reducer'
import { useAppDispatch, useAppSelector } from '../../app/store'

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  const formik = useFormik({
    validate: values => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = 'Email is required!'
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address'
      }
      if (!values.password) {
        errors.password = 'Password is required!'
      } else if (values.password.length < 3) {
        errors.password = 'Must be 3 characters or more'
      }
      return errors
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (values, formikHelpers) => {
      const action = await dispatch(login(values))
      if (login.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          action.payload.fieldsErrors.forEach(err => {
            formikHelpers.setFieldError(err.field, err.error)
          })
        }
      } else {
        formik.resetForm()
      }
    },
  })

  if (isLoggedIn) {
    return <Navigate to="/" />
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <FormControl>
          <FormLabel>
            <p>
              To log in get registered
              <a
                href={'https://social-network.samuraijs.com/'}
                target={'_blank'}
                rel="noreferrer"
              >
                {' '}
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
                {...formik.getFieldProps('email')}
              />
              <TextField
                type="password"
                label="Password"
                margin="normal"
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
                {...formik.getFieldProps('password')}
              />
              <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                    {...formik.getFieldProps('rememberMe')}
                    checked={formik.values.rememberMe}
                  />
                }
              />
              <Button type={'submit'} variant={'contained'} color={'primary'}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  )
}
