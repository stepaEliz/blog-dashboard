<template>
  <div
    class="min-h-screen flex items-center justify-center dark:bg-gray-900 px-4"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transition-all"
    >
      <h2
        class="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100"
      >
        Login to Your Account
      </h2>

      <form @submit.prevent="submitLogin" class="space-y-4">
        <!-- Email -->
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Password -->
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Main Login Button -->
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-all duration-150 cursor-pointer hover:scale-105"
        >
          Login
        </button>

        <!-- Guest Button -->
        <button
          type="button"
          @click="loginAsGuest"
          class="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
        >
          Login as Guest
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "#app";
import { useToast } from '@/composables/useToast'
definePageMeta({ layout: "clean", title: "Login | Nuxt Blog" });

const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();

const email = ref("");
const password = ref("");
const message = ref("");
const error = ref("");

const submitLogin = async () => {
  message.value = "";
  error.value = "";

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (loginError) {
    toast.error(loginError.message);
    return;
  }

  toast.success("Login successful!");
  setTimeout(() => router.push("/dashboard"), 1000);
};

const loginAsGuest = async () => {
  const { data, error: guestError } = await supabase.auth.signInWithPassword({
    email: "guest@demo.com",
    password: "12345678",
  });

  if (guestError) {
    toast.error(guestError.message);
  } else {
    toast.success("Logged in as guest!");
    setTimeout(() => router.push("/dashboard"), 1000);
  }
};
</script>
