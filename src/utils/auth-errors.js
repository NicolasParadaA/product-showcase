export const FIREBASE_ERRORS = {
  'auth/user-not-found': 'No existe una cuenta con este email.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/email-already-in-use': 'Ya existe una cuenta con este email.',
  'auth/invalid-email': 'El formato del email no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde.',
  'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
  'auth/invalid-credential': 'Credenciales inválidas. Verifica email y contraseña.',
}

export function translateAuthError(code) {
  return FIREBASE_ERRORS[code] || 'Ocurrió un error inesperado. Intenta de nuevo.'
}
