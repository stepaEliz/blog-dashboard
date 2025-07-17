<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      
      <!-- Title and button -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
          My Posts
        </h1>
        <NuxtLink
          to="/create"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          + Add Post
        </NuxtLink>
      </div>

      <!-- Information for the guest -->
      <div
        v-if="user?.email === 'guest@demo.com'"
        class="mb-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-3 text-sm rounded-md text-center"
      >
        You are logged in as <strong class="text-blue-600 dark:text-blue-300">guest</strong>. Posts you create will be
        public and visible to everyone.
      </div>

      <!-- Preloader -->
      <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400 py-12">
        Loading...
      </div>

      <!-- No posts -->
      <div
        v-else-if="posts.length === 0"
        class="text-center text-gray-700 dark:text-gray-300 mt-20 space-y-2"
      >
        <p class="text-xl font-medium">You haven’t written anything yet.</p>
        <p class="text-sm">Click the button above to create your first post!</p>
      </div>

      <!-- Posts -->
      <div v-else class="grid gap-6 md:grid-cols-2 mt-6">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @delete="deletePost"
          class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition duration-200 hover:scale-105"
        />
      </div>
    </div>
  </div>
</template>




<script setup>
import PostCard from "@/components/PostCard.vue";
import { useToast } from '@/composables/useToast'

definePageMeta({ middleware: "auth", title: "Dashboard | Nuxt Blog"});

import { useSupabaseClient, useSupabaseUser } from "#imports";
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const posts = ref([]);
const loading = ref(true);

const toast = useToast()

const fetchPosts = async () => {
  loading.value = true;

  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (user.value?.email !== "guest@demo.com") {
    query = query.eq("user_id", user.value.id); // Only mine - if not a guest
  }

  const { data, error } = await query;

  if (!error) posts.value = data;
  loading.value = false;
};

const deletePost = async (id) => {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select();

  if (error || !data || data.length === 0) {
    toast.error("🚫 You do not have permission to delete this post.");
    return;
  }

  toast.success('✅ Post deleted')

  posts.value = posts.value.filter((post) => post.id !== id);
};

// saving the route
watchEffect(() => {
  if (!user.value) {
    router.push("/login");
  }
});

onMounted(async () => {
  const { data: session } = await supabase.auth.getSession();
  const { data: user } = await supabase.auth.getUser();
  console.log("Session restored:", session, user);
  fetchPosts();
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};
</script>
