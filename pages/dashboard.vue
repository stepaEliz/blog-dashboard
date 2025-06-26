<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-semibold">My Dashboard</h2>
      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>

    <div class="mb-8">
      <NuxtLink to="/create" class="text-blue-600 hover:underline">
        ➕ Create New Post
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-gray-500">Loading your posts...</div>
    <div v-else-if="posts.length === 0" class="text-gray-500">
      You have no posts yet.
    </div>

    <div class="grid gap-4 md:grid-cols-2" v-else>
      <div
        v-for="post in posts"
        :key="post.id"
        class="p-4 border rounded-lg shadow hover:shadow-md transition relative"
      >
        <h3 class="text-xl font-bold mb-2">{{ post.title }}</h3>
        <p class="text-gray-700 whitespace-pre-line">{{ post.content }}</p>
        <p class="text-sm text-gray-400 mt-3">
          Posted on {{ formatDate(post.created_at) }}
        </p>

        <div class="absolute top-2 right-2 flex gap-2">
          <NuxtLink
            :to="`/edit/${post.id}`"
            class="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            ✏️
          </NuxtLink>
          <button
            @click="deletePost(post.id)"
            class="text-red-500 hover:text-red-700"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "clean" });

import { useSupabaseClient, useSupabaseUser } from "#imports";
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const posts = ref([]);
const loading = ref(true);

const fetchPosts = async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.value.id)
    .order("created_at", { ascending: false });

  if (!error) posts.value = data;
  loading.value = false;
};

const deletePost = async (id) => {
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    alert("Error deleting post: " + error.message);
  } else {
    // удалили → обновим список
    posts.value = posts.value.filter((post) => post.id !== id);
  }
};

const logout = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};

// защищаем маршрут
watchEffect(() => {
  if (!user.value) {
    router.push("/login");
  }
});

onMounted(() => {
  fetchPosts();
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};
</script>
