import { sleep } from '../utils/timer-utils'
import { initializeApp } from './app-reducer'
import store from './store'

test('app status should be loading', async () => {
  const action = initializeApp()

  store.dispatch(action)

  await sleep(0)
  expect(store.getState().app.isInitialized).toBeFalsy()
  expect(store.getState().app.status).toBe('loading')
})

test('app should be initialized', async () => {
  await sleep(12)
  expect(store.getState().auth.isLoggedIn).toBeTruthy()
  expect(store.getState().app.isInitialized).toBeTruthy()
  expect(store.getState().todolists).toHaveLength(0)
})

test('todolists should be loaded', async () => {
  await sleep(12)
  expect(store.getState().todolists).toHaveLength(2)
  expect(store.getState().todolists[0].title).toBe('What to learn')
  expect(store.getState().tasks['1']).toBeDefined()
  expect(store.getState().tasks['2']).toEqual([])
  expect(Object.keys(store.getState().tasks)).toHaveLength(2)
})

test('tasks should be loaded', async () => {
  await sleep(20)
  expect(store.getState().tasks['2'][2].title).toBe('tea')
  expect(store.getState().app.status).toBe('succeeded')
})
