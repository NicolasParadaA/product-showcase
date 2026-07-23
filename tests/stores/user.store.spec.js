import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// mock firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'docRef'),
  getDoc: vi.fn(),
}))

// mock db export
vi.mock('@/firebaseConfig.js', () => ({
  db: {},
}))

import { useUserStore } from '../../src/stores/user.store'

let store

beforeEach(() => {
  setActivePinia(createPinia())
  store = useUserStore()
  vi.clearAllMocks()
})

describe('user store', () => {
  describe('initial state', () => {
    it('should have user as null', () => {
      expect(store.user).toBeNull()
    })

    it('should have isAuthenticated as false', () => {
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('setUserFromAuth', () => {
    it('should set user and isAuthenticated when given a valid firebase user', async () => {
      const { getDoc } = await import('firebase/firestore')
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ firstname: 'John', lastname: 'Doe', role: 'admin' }),
      })

      const firebaseUser = { uid: 'uid123', email: 'john@example.com' }
      await store.setUserFromAuth(firebaseUser)

      expect(store.user).toEqual({
        uid: 'uid123',
        email: 'john@example.com',
        firstname: 'John',
        lastname: 'Doe',
        role: 'admin',
      })
      expect(store.isAuthenticated).toBe(true)
    })

    it('should clear user when given null', async () => {
      // First set a user
      const { getDoc } = await import('firebase/firestore')
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ firstname: 'Jane' }),
      })
      await store.setUserFromAuth({ uid: 'uid456', email: 'jane@example.com' })
      expect(store.isAuthenticated).toBe(true)

      // Now clear it
      await store.setUserFromAuth(null)
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should handle Firestore document not existing', async () => {
      const { getDoc } = await import('firebase/firestore')
      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => ({}),
      })

      const firebaseUser = { uid: 'uid789', email: 'bob@example.com' }
      await store.setUserFromAuth(firebaseUser)

      expect(store.user).toEqual({
        uid: 'uid789',
        email: 'bob@example.com',
      })
      expect(store.isAuthenticated).toBe(true)
    })

    it('should handle Firestore error gracefully', async () => {
      const { getDoc } = await import('firebase/firestore')
      getDoc.mockRejectedValue(new Error('Firestore error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const firebaseUser = { uid: 'uid999', email: 'error@example.com' }
      await store.setUserFromAuth(firebaseUser)

      expect(store.user).toEqual({
        uid: 'uid999',
        email: 'error@example.com',
      })
      expect(store.isAuthenticated).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user profile:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('clearUser', () => {
    it('should reset user to null', async () => {
      // First set a user
      const { getDoc } = await import('firebase/firestore')
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ firstname: 'Test' }),
      })
      await store.setUserFromAuth({ uid: 'uid111', email: 'test@example.com' })
      expect(store.isAuthenticated).toBe(true)

      // Clear it
      store.clearUser()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })
})