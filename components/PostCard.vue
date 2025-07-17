<template>
  <div
    class="flex flex-col gap-3 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:scale-[1.02]"
  >
    <!-- Title -->
    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
      {{ post.title }}
    </h2>

    <!-- Content -->
    <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
      {{ post.content }}
    </p>

    <!-- Image -->
    <img
      v-if="post.image_url"
      :src="post.image_url"
      alt="Post Image"
      class="rounded-md object-cover max-h-60 w-full border border-gray-200 dark:border-gray-600"
    />

    <!-- Post link -->
    <NuxtLink
      :to="`/posts/${post.id}`"
      class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
    >
      Read more →
    </NuxtLink>

    <!-- Edit buttons -->
    <div
      v-if="canEdit"
      class="mt-4 flex gap-2 justify-end"
    >
      <NuxtLink
        :to="`/edit/${post.id}`"
        class="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-md font-medium cursor-pointer"
      >
        ✏️ Edit
      </NuxtLink>
      <button
        @click="$emit('delete', post.id)"
        class="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md font-medium cursor-pointer"
      >
        🗑 Delete
      </button>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()

const props = defineProps({
  post: Object,
})

// Only author or guest can edit/delete
const canEdit = computed(() => {
  if (!user.value) return false
  return (
    user.value.email === 'guest@demo.com' ||
    user.value.id === props.post.user_id
  )
})
</script>
