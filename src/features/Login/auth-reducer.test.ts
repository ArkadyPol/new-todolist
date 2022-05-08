import { authReducer, InitialStateType, setIsLoggedIn } from './auth-reducer'

let startState: InitialStateType

beforeEach(() => {
  startState = {
    isLoggedIn: false,
  }
})

test('auth should be logged in', () => {
  const endState = authReducer(startState, setIsLoggedIn(true))

  expect(endState.isLoggedIn).toBeTruthy()
})
