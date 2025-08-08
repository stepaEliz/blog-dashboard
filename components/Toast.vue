<template>
  <div
    v-show="visible"
    class="fixed bottom-4 right-4 w-80 z-50 flex items-center p-4 rounded-lg shadow-lg
           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all transform
           duration-300"
    :class="typeClasses"
  >
    <div class="flex-1 text-sm">
      {{ message }}
    </div>
    <button @click="visible = false" class="ml-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
      ✕
    </button>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
const props = defineProps({
  id: String,
  message: String,
  type: { type: String, default: 'info' }, // 'success' | 'error' | 'info'
  duration: { type: Number, default: 3000 }
})

const visible = ref(true)

const typeClasses = computed(() => ({
  'bg-green-100 dark:bg-green-900': props.type === 'success',
  'bg-red-100 dark:bg-red-900': props.type === 'error',
  'bg-blue-100 dark:bg-blue-900': props.type === 'info',
}))

// Auto-hide
watchEffect((onInvalidate) => {
  const timer = setTimeout(() => (visible.value = false), props.duration)
  onInvalidate(() => clearTimeout(timer))
})
</script>
