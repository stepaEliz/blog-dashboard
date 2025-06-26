<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-3xl font-semibold mb-6">Edit Post</h2>

    <form @submit.prevent="updatePost" class="space-y-4" v-if="loaded">
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700"
          >Title</label
        >
        <input
          v-model="title"
          type="text"
          class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700"
          >Content</label
        >
        <textarea
          v-model="content"
          rows="5"
          class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
      >
        Save Changes
      </button>

      <p v-if="successMessage" class="text-green-600">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: "clean" });

import { useRoute, useRouter } from "vue-router";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { ref, onMounted } from "vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const router = useRouter();

const title = ref("");
const content = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const loaded = ref(false);

const postId = route.params.id;

onMounted(async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("title, content, user_id")
    .eq("id", postId)
    .single();

  if (error) {
    errorMessage.value = "Could not load post";
  } else if (data.user_id !== user.value.id) {
    errorMessage.value = "You do not have permission to edit this post";
  } else {
    title.value = data.title;
    content.value = data.content;
    loaded.value = true;
  }
});

const updatePost = async () => {
  const { error } = await supabase
    .from("posts")
    .update({
      title: title.value,
      content: content.value,
    })
    .eq("id", postId);

  if (error) {
    errorMessage.value = error.message;
  } else {
    successMessage.value = "Post updated successfully!";
    setTimeout(() => router.push("/dashboard"), 1000);
  }
};
</script>
