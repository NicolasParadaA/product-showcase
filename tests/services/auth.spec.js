import { vi, describe, it, expect, beforeEach } from 'vitest'

// mock firebase/auth
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
}))

// mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'docRef'),
  setDoc: vi.fn(),
}))

// mock firebaseConfig using alias
vi.mock('@/firebaseConfig.js', () => ({
  auth: {},
  db: {},
}))

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { register, login, sendPasswordReset, logout } from '../../src/services/auth'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('auth service', () => {
  describe('login', () => {
    it('should call signInWithEmailAndPassword and return user', async () => {
      const mockUser = { uid: 'uid123', email: 'test@example.com' }
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser })

      const result = await login('test@example.com', 'password123')

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123')
      expect(result).toEqual(mockUser)
    })
  })

  describe('register', () => {
    it('should call createUserWithEmailAndPassword + setDoc and return user', async () => {
      const mockUser = { uid: 'uid456', email: 'new@example.com' }
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser })
      setDoc.mockResolvedValue()

      const profile = { firstname: 'John', lastname: 'Doe', role: 'admin' }
      const result = await register('new@example.com', 'password123', profile)

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'new@example.com', 'password123')
      expect(doc).toHaveBeenCalledWith({}, 'users', 'uid456')
      expect(setDoc).toHaveBeenCalledWith('docRef', {
        firstname: 'John',
        lastname: 'Doe',
        role: 'admin',
        email: 'new@example.com',
        createdAt: expect.any(String),
      })
      expect(result).toEqual(mockUser)
    })

    it('should use default profile values when not provided', async () => {
      const mockUser = { uid: 'uid789', email: 'default@example.com' }
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser })
      setDoc.mockResolvedValue()

      await register('default@example.com', 'password123')

      expect(setDoc).toHaveBeenCalledWith('docRef', {
        firstname: '',
        lastname: '',
        role: 'user',
        email: 'default@example.com',
        createdAt: expect.any(String),
      })
    })

    it('should delete auth user and throw when Firestore write fails', async () => {
      const mockDelete = vi.fn().mockResolvedValue()
      const mockUser = { uid: 'uid999', email: 'fail@example.com', delete: mockDelete }
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser })
      setDoc.mockRejectedValue(new Error('Firestore error'))

      await expect(register('fail@example.com', 'password123')).rejects.toThrow(
        'El perfil de usuario no se pudo guardar en Firestore. Revisa las reglas de seguridad.',
      )

      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('sendPasswordReset', () => {
    it('should call sendPasswordResetEmail', async () => {
      sendPasswordResetEmail.mockResolvedValue()

      await sendPasswordReset('reset@example.com')

      expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, 'reset@example.com')
    })
  })

  describe('logout', () => {
    it('should call signOut', async () => {
      signOut.mockResolvedValue()

      await logout()

      expect(signOut).toHaveBeenCalledWith({})
    })
  })
})