<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-3xl font-semibold mb-6">Create a New Post</h2>

    <form @submit.prevent="submitPost" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700">Title</label>
        <input
          v-model="title"
          type="text"
          placeholder="Enter post title"
          class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700">Content</label>
        <textarea
          v-model="content"
          placeholder="Write something..."
          rows="5"
          class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition-all duration-200"
      >
        Publish Post
      </button>

      <p v-if="successMessage" class="text-green-600">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'clean' })

import { ref } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const title = ref('')
const content = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const submitPost = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!title.value.trim()) {
    errorMessage.value = 'Title is required'
    return
  }

  const { error } = await supabase.from('posts').insert({
    title: title.value,
    content: content.value,
    user_id: user.value.id
  })

  if (error) {
    errorMessage.value = error.message
  } else {
    successMessage.value = 'Post created successfully!'
    title.value = ''
    content.value = ''
  }
}
</script>
