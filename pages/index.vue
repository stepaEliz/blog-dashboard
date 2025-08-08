<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
  >
    <div class="max-w-4xl mx-auto text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Welcome to Nuxt Blog ✨
      </h1>
      <p class="text-gray-600 dark:text-gray-300 text-lg mb-6">
        A modern fullstack blog built with Nuxt 3, Supabase, Tailwind CSS, and
        RLS.
      </p>

      <div
        class="flex flex-col sm:flex-row gap-4 justify-center sm:items-center sm:justify-center"
      >
        <NuxtLink
          to="/login"
          class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-150 cursor-pointer hover:scale-105"
        >
          Login
        </NuxtLink>

        <button
          @click="loginAsGuest"
          class="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-6 py-3 rounded-lg shadow-md transition-all duration-150 hover:scale-105 cursor-pointer"
        >
          Login as Guest
        </button>
      </div>
    </div>

    <!-- Public Feed -->
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
        Recent Posts
      </h2>

      <div
        v-if="loading"
        class="text-center text-gray-500 dark:text-gray-400 py-12"
      >
        Loading posts...
      </div>

      <div
        v-else-if="posts.length === 0"
        class="text-center text-gray-700 dark:text-gray-300 py-12 space-y-2"
      >
        <p class="text-xl font-medium">No posts available yet.</p>
        <p class="text-sm">
          Be the first to
          <NuxtLink
            to="/create"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            >create one</NuxtLink
          >!
        </p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 mt-6">
        <div
          v-for="post in posts"
          :key="post.id"
          class="w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition duration-200 hover:scale-105"
        >
          <h3 class="text-xl font-semibold mb-2">
            {{ post.title }}
          </h3>
          <p class="text-sm mb-3 line-clamp-3 text-gray-600 dark:text-gray-400">
            {{ post.content }}
          </p>

          <img
            v-if="post.image_url"
            :src="post.image_url"
            alt="Post image"
            class="rounded-md object-cover max-h-60 w-full mb-4 border border-gray-200 dark:border-gray-700"
          />

          <NuxtLink
            :to="`/posts/${post.id}`"
            class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Read more →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSupabaseClient, useRouter } from "#imports";
definePageMeta({ layout: "clean" });

useHead({
  title: "Welcome to Nuxt Blog — Fullstack Demo with Supabase",
  meta: [
    {
      name: "description",
      content:
        "Explore public posts or login as a guest to test full CRUD with Supabase and Nuxt 3.",
    },
  ],
});

const supabase = useSupabaseClient();
const router = useRouter();
const posts = ref([]);
const loading = ref(true);

onMounted(async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, image_url")
    .order("created_at", { ascending: false });

  if (!error) posts.value = data;
  loading.value = false;
});

const loginAsGuest = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: "guest@demo.com",
    password: "12345678",
  });
  if (!error) router.push("/dashboard");
};
</script>
