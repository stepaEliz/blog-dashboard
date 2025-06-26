<template>
  <div class="p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" class="mb-2 w-full border p-2 rounded" />
      <input v-model="password" type="password" placeholder="Password" class="mb-4 w-full border p-2 rounded" />
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Register</button>
    </form>
    <p v-if="message" class="text-green-600 mt-2">{{ message }}</p>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'clean' })

import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const error = ref('')
const message = ref('')

const register = async () => {
  const { error: err } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (err) {
    error.value = err.message
    message.value = ''
  } else {
    message.value = 'Check your email to confirm your registration!'
    error.value = ''
  }
}
</script>