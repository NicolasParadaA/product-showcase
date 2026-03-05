import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebaseConfig'

export async function register(email, password, profile = {}) {
  // create auth user first
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const uid = userCredential.user.uid
  try {
    await setDoc(doc(db, 'users', uid), {
      firstname: profile.firstname || '',
      lastname: profile.lastname || '',
      role: profile.role || 'user',
      email,
      createdAt: new Date().toISOString(),
    })
  } catch (e) {
    // Firestore write failed (probably due to rules).
    // remove the partially created auth user to avoid orphan accounts.
    try {
      await userCredential.user.delete()
    } catch (_) {
      console.error('Failed to delete auth user after profile failure')
    }
    throw new Error(
      'El perfil de usuario no se pudo guardar en Firestore. Revisa las reglas de seguridad.',
    )
  }
  return userCredential.user
}

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function sendPasswordReset(email) {
  return sendPasswordResetEmail(auth, email)
}

export async function logout() {
  return signOut(auth)
}