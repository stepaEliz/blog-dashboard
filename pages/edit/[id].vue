<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
    <div
      class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
    >
      <h2
        class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center"
      >
        Edit Post
      </h2>

      <!-- Access Denied -->
      <div
        v-if="accessDenied"
        class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-4 py-3 rounded-md text-sm font-medium text-center mb-6"
      >
        🚫 Access Denied
      </div>

      <!-- Form -->
      <form v-if="loaded" @submit.prevent="updatePost" class="space-y-6">
        <!-- Title -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Title
          </label>
          <input
            v-model="title"
            type="text"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Content -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Content
          </label>
          <textarea
            v-model="content"
            rows="5"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Image -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-blue-100 dark:file:bg-gray-700 file:text-blue-800 dark:file:text-gray-100 hover:file:bg-blue-200 dark:hover:file:bg-gray-600"
          />

          <div v-if="imageUrl" class="mt-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Current Image:
            </p>
            <img
              :src="imageUrl"
              class="rounded-lg shadow w-full max-h-64 object-contain border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
definePageMeta({ title: "Edit Post | Nuxt Blog" });
useHead({
  title: "Edit Post | Nuxt Blog",
});

import { useRoute, useRouter } from "vue-router";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { ref, onMounted } from "vue";
import { useToast } from "@/composables/useToast";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const title = ref("");
const content = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const loaded = ref(false);
const accessDenied = ref(false);
const imageUrl = ref("");
let newFile = null;

const postId = route.params.id;

onMounted(async () => {
  if (!user.value) return;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error || !data) {
    accessDenied.value = true;
    return;
  }

  title.value = data.title;
  content.value = data.content;
  loaded.value = true;
  imageUrl.value = data.image_url || "";
});

const updatePost = async () => {
  let uploadedImageUrl = imageUrl.value;

  if (newFile) {
    const fileExt = newFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, newFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    uploadedImageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title: title.value,
      content: content.value,
      image_url: uploadedImageUrl,
    })
    .eq("id", postId);

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Post updated successfully!");
    setTimeout(() => router.push("/dashboard"), 1000);
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  newFile = file;
};
</script>
