<template>
  <div class="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-3xl mx-auto">
      <!-- Loading -->
      <div
        v-if="loading"
        class="text-center text-gray-500 dark:text-gray-400 text-lg"
      >
        Loading post...
      </div>

      <!-- Error -->
      <div
        v-else-if="!post"
        class="text-center bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-3 rounded-md font-medium"
      >
        🚫 Post not found or access denied.
      </div>

      <!-- Post -->
      <div
        v-else
        class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
      >
        <h1
          class="text-4xl font-bold mb-6 text-gray-800 dark:text-white text-center"
        >
          {{ post.title }}
        </h1>

        <img
          v-if="post.image_url"
          :src="post.image_url"
          alt="Post image"
          class="rounded-lg shadow mb-6 max-h-[400px] w-full object-contain border border-gray-200 dark:border-gray-700"
        />

        <p
          class="text-lg leading-relaxed whitespace-pre-line text-gray-800 dark:text-gray-200"
        >
          {{ post.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useSupabaseClient } from "#imports";

definePageMeta({ middleware: "auth", title: "View Post | Nuxt Blog" });

const route = useRoute();
const supabase = useSupabaseClient();

const post = ref(null);
const loading = ref(true);

onMounted(async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, image_url")
    .eq("id", route.params.id)
    .single();

  if (!error) {
    post.value = data;
    useHead({
      title: post.value?.title
        ? `${post.value.title} | Nuxt Blog`
        : "Post | Nuxt Blog",
    });
  }
  loading.value = false;
});
</script>
