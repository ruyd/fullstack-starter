import request from 'supertest'
import createBackendApp from '../src/app'
import { getRoutesFromApp } from '../src/shared/server'
import { beforeAllHook } from './helpers'

beforeAll(() => beforeAllHook())
describe('server route checks', () => {
  const app = createBackendApp({ checks: false, trace: false })
  const routes = getRoutesFromApp(app)

  test('should have at least one route', () => {
    expect(routes.length).toBeGreaterThan(0)
  })
  test('should return a 200 status code', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})
