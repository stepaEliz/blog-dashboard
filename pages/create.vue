<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
    <div
      class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
    >
      <h2
        class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center"
      >
        Create a New Post
      </h2>

      <form @submit.prevent="submitPost" class="space-y-6">
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
            placeholder="Enter post title"
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
            placeholder="Write something..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Image Upload -->
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
            class="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-100 dark:file:bg-gray-700 file:text-blue-800 dark:file:text-gray-100 file:rounded-lg hover:file:bg-blue-200 dark:hover:file:bg-gray-600"
          />
          <p
            v-if="uploading"
            class="text-sm text-gray-500 dark:text-gray-400 mt-2"
          >
            Uploading...
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          Publish Post
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
useHead({
  title: "Create Post | Nuxt Blog",
  meta: [
    {
      name: "description",
      content: "Write a new post with a title, content, and optional image.",
    },
  ],
});

import { ref } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { nanoid } from "nanoid";
import { useToast } from "@/composables/useToast";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const toast = useToast();

const title = ref("");
const content = ref("");
const imageFile = ref(null);
const imageUrl = ref("");
const uploading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  const filename = `${user.value.id}/${nanoid()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filename, file);

  if (uploadError) {
    toast.error("Upload failed: " + uploadError.message);
    uploading.value = false;
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filename);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    toast.error("Could not get image URL");
  } else {
    imageUrl.value = publicUrlData.publicUrl;
    console.log("✅ Image URL:", imageUrl.value);
  }

  uploading.value = false;
};

const submitPost = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!title.value.trim()) {
    toast.error("Title is required");
    return;
  }

  console.log("🟢 Final image URL:", imageUrl.value);

  if (!user.value) {
    toast.error("You must be logged in");
    return;
  }

  const { error } = await supabase.from("posts").insert({
    title: title.value,
    content: content.value,
    user_id: user.value.id,
    image_url: imageUrl.value,
  });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Post created successfully!");
    title.value = "";
    content.value = "";
    imageUrl.value = "";
    setTimeout(() => router.push("/dashboard"), 1000);
  }
};
</script>
