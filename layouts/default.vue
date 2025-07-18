<template>
  <div
    class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <!-- Left block -->
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Nuxt Blog
          </NuxtLink>
          <NuxtLink
            to="/dashboard"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/create"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            Create
          </NuxtLink>
        </div>

        <!-- Right block -->
        <div class="flex items-center gap-3">
          <span v-if="user" class="text-sm text-gray-600 dark:text-gray-300">
            👋 {{ user.email }}
          </span>

          <button
            v-if="user"
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md shadow-sm cursor-pointer transition"
          >
            Logout
          </button>

          <button
            @click="toggle"
            class="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded-md cursor-pointer transition"
          >
            {{ dark ? "🌙 Dark" : "☀️ Light" }}
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="px-4 transition-all duration-300">
      <slot />
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
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const { dark, toggle } = useDarkMode();
const { toasts } = useToastStore();

useHead({
  titleTemplate: "%s",
  meta: [
    {
      name: "description",
      content: "A fullstack blog powered by Nuxt and Supabase",
    },
  ],
});

const handleLogout = async () => {
  const confirmed = confirm("Are you sure you want to log out?");
  if (!confirmed) return;

  await supabase.auth.signOut();
  router.push("/login");
};
</script>
