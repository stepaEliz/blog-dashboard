<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <main class="flex items-center justify-center px-4 py-10">
      <div class="w-full max-w-3xl">
        <slot />
      </div>
    </main>

    <!-- Toasts -->
    <div>
      <Toast
        v-for="t in toasts"
        :key="t.id"
        :id="t.id"
        :message="t.message"
        :type="t.type"
        :duration="t.duration"
      />
    </div>
  </div>
</template>

<script setup>
import Toast from "@/components/Toast.vue";
const { toasts } = useToastStore();
</script>