
// eslint-disable-next-line import/extensions
import { fetchEmployees } from '../services'

describe('services', () => {
  describe('fetchEmployess', () => {
    it('should retrieve information without throwing an error', () => expect(fetchEmployees(5, 10)).resolves.not.toBeNull())
    it('should be an error', () => fetchEmployees(100, 100).catch(() => {
      expect(true).toBe(true)
    }))
    it('should retrieve information without throwing an error and to be a valid data', () => expect(fetchEmployees(5, 10)).resolves.toBeInstanceOf(Array))
  })
})
