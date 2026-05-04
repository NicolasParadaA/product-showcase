<template>

<v-container>
    <v-row justify="center">
        <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-4">
                <v-card-title class="text-center mb-4 text-h4">Registrar cuenta</v-card-title>
                <v-form @submit.prevent="onRegister">
                    <v-text-field v-model="firstname" label="Nombre" required class="mb-3"></v-text-field>
                    <v-text-field v-model="lastname" label="Apellido" required class="mb-3"></v-text-field>
                    <v-text-field v-model="email" type="email" label="Email" required class="mb-3"></v-text-field>
                    <v-text-field v-model="password" type="password" label="Contraseña" required class="mb-3"></v-text-field>
                    <v-text-field v-model="confirm" type="password" label="Confirmar Contraseña" required class="mb-4"></v-text-field>
                    <v-btn type="submit" color="primary" size="large" block>Crear cuenta</v-btn>
                </v-form>
                <v-alert v-if="error" type="error" class="mt-3">{{ error }}</v-alert>
            </v-card>
        </v-col>
    </v-row>
</v-container>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/auth'

const router = useRouter()
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')

async function onRegister() {
    error.value = ''
    if (password.value !== confirm.value) {
        error.value = 'Las contraseñas no coinciden'
        return
    }
    try {
        await register(email.value, password.value, {
            firstname: firstname.value,
            lastname: lastname.value,
        })
        router.push('/')
    } catch (e) {
        error.value = e.message || 'Error al crear cuenta'
    }
}
</script>

<style scoped>
.register-container {
    display: none;
}

</style>