<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card p-4">
                    <h2 class="mb-4 text-center">Iniciar sesión</h2>
                    <form @submit.prevent="onLogin">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input id="email" v-model="email" type="email" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input id="password" v-model="password" type="password" class="form-control" required />
                        </div>
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary">Entrar</button>
                            <button type="button" class="btn btn-link" @click="onReset">Recuperar contraseña</button>
                        </div>
                    </form>
                    <p class="mt-3">
                        ¿No tienes cuenta?
                        <router-link to="/register">Regístrate</router-link>
                    </p>
                    <p v-if="error" class="text-danger">{{ error }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, sendPasswordReset } from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function onLogin() {
    error.value = ''
    try {
        await login(email.value, password.value)
        router.push('/')
    } catch (e) {
        error.value = e.message || 'Error en el inicio de sesión'
    }
}

async function onReset() {
    const mail = prompt('Introduce tu email para recuperar la contraseña:')
    if (!mail) return
    try {
        await sendPasswordReset(mail)
        alert('Correo de recuperación enviado')
    } catch (e) {
        alert(e.message || 'Error al enviar correo')
    }
}
</script>

<style scoped>

.login-container {
    display: none;
}
</style>