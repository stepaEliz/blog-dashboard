<template>
  <div class="p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" class="mb-2 w-full border p-2 rounded" />
      <input v-model="password" type="password" placeholder="Password" class="mb-4 w-full border p-2 rounded" />
      <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Login</button>
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

const login = async () => {
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (err) {
    error.value = err.message
    message.value = ''
  } else {
    message.value = 'Login successful!'
    error.value = ''
  }
}
</script>