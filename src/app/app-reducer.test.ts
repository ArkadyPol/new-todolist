import {
  appReducer,
  setAppError,
  setAppStatus,
  InitialStateType,
  initializeApp,
} from './app-reducer'

let startState: InitialStateType

beforeEach(() => {
  startState = {
    status: 'idle',
    error: null,
    isInitialized: false,
  }
})

test('correct error message should be set', () => {
  const endState = appReducer(startState, setAppError('some error'))

  expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
  const endState = appReducer(startState, setAppStatus('loading'))

  expect(endState.status).toBe('loading')
})

test('app should be initialized', () => {
  const action = initializeApp.fulfilled(undefined, 'requestId', undefined)

  const endState = appReducer(startState, action)

  expect(endState.isInitialized).toBeTruthy()
})
