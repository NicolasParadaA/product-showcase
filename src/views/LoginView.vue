<template>
  <v-container>
    <v-row
      justify="center"
      align="center"
      class="mt-16"
    >
      <v-col
        cols="12"
        md="5"
      >
        <v-card class="pa-6 elevation-4">
          <v-card-title class="text-center mb-4 text-h4">
            Iniciar sesión
          </v-card-title>
          <v-form @submit.prevent="onLogin">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              required
              class="mb-3"
            />
            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              required
              class="mb-4"
            />
            <v-btn
              type="submit"
              color="primary"
              block
              class="mb-2"
              :loading="loading"
            >
              Entrar
            </v-btn>
            <v-btn
              type="button"
              variant="text"
              block
              @click="resetDialog = true"
            >
              Recuperar contraseña
            </v-btn>
          </v-form>
          <p class="mt-4 text-center">
            ¿No tienes cuenta? <router-link to="/register">
              Regístrate
            </router-link>
          </p>
          <v-alert
            v-if="error"
            type="error"
            class="mt-3"
          >
            {{ error }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Password Reset Dialog -->
    <v-dialog
      v-model="resetDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h6">
          Recuperar contraseña
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="resetEmail"
            label="Email"
            type="email"
            :rules="[rules.required, rules.email]"
          />
          <v-alert
            v-if="resetSuccess"
            type="success"
            class="mb-3"
          >
            Correo de recuperación enviado
          </v-alert>
          <v-alert
            v-if="resetError"
            type="error"
            class="mb-3"
          >
            {{ resetError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="resetDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="resetLoading"
            :disabled="!resetEmail"
            @click="onReset"
          >
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, sendPasswordReset } from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Password reset dialog state
const resetDialog = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)
const resetSuccess = ref(false)
const resetError = ref('')

const rules = {
  required: (v) => !!v || 'Email es requerido',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email inválido',
}

async function onLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Error en el inicio de sesión'
  } finally {
    loading.value = false
  }
}

async function onReset() {
  resetError.value = ''
  resetSuccess.value = false
  resetLoading.value = true
  try {
    await sendPasswordReset(resetEmail.value)
    resetSuccess.value = true
  } catch (e) {
    resetError.value = e.message || 'Error al enviar correo'
  } finally {
    resetLoading.value = false
  }
}
</script>

<style scoped></style>
