<template>

<v-container>
    <v-row justify="center" align="center" class="mt-16">
        <v-col cols="12" md="5">
            <v-card class="pa-4">
                <v-card-title class="text-center mb-4">Iniciar sesión</v-card-title>
                <v-form @submit.prevent="onLogin">
                    <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
                    <v-text-field v-model="password" label="Contraseña" type="password" required></v-text-field>
                    <v-btn type="submit" color="primary" block class="mb-2">Entrar</v-btn>
                    <v-btn type="button" variant="text" @click="onReset" block>Recuperar contraseña</v-btn>
                </v-form>
                <p class="mt-3">¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
                <v-alert v-if="error" type="error" class="mt-3">{{ error }}</v-alert>
            </v-card>
        </v-col>
    </v-row>
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

</style>