import { describe, it, expect } from 'vitest'
import { FIREBASE_ERRORS, translateAuthError } from '@/utils/auth-errors.js'

describe('FIREBASE_ERRORS', () => {
  it('maps auth/user-not-found to Spanish message', () => {
    expect(FIREBASE_ERRORS['auth/user-not-found']).toBe('No existe una cuenta con este email.')
  })

  it('maps auth/wrong-password to Spanish message', () => {
    expect(FIREBASE_ERRORS['auth/wrong-password']).toBe('La contraseña es incorrecta.')
  })

  it('maps auth/email-already-in-use to Spanish message', () => {
    expect(FIREBASE_ERRORS['auth/email-already-in-use']).toBe('Ya existe una cuenta con este email.')
  })

  it('maps auth/invalid-email to Spanish message', () => {
    expect(FIREBASE_ERRORS['auth/invalid-email']).toBe('El formato del email no es válido.')
  })

  it('maps auth/weak-password to Spanish message', () => {
    expect(FIREBASE_ERRORS['auth/weak-password']).toBe('La contraseña debe tener al menos 6 caracteres.')
  })

  it('maps auth/too-many-requests to Spanish message', () => {
    expect(FIREBASE_ERRORS['auth/too-many-requests']).toBe('Demasiados intentos. Intenta de nuevo más tarde.')
  })

  it('maps auth/network-request-failed to Spanish message', () => {
    expect(FIREBASE_ERRORS['auth/network-request-failed']).toBe('Error de conexión. Verifica tu internet.')
  })

  it('maps auth/invalid-credential to Spanish message', () => {
    expect(FIREBASE_ERRORS['auth/invalid-credential']).toBe('Credenciales inválidas. Verifica email y contraseña.')
  })
})

describe('translateAuthError', () => {
  it('returns Spanish message for known error code', () => {
    expect(translateAuthError('auth/user-not-found')).toBe('No existe una cuenta con este email.')
  })

  it('returns fallback message for unknown error code', () => {
    expect(translateAuthError('auth/unknown-code')).toBe('Ocurrió un error inesperado. Intenta de nuevo.')
  })
})
