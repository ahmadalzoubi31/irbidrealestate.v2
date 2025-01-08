<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
const toast = useToast();

// Reactive State
const state = reactive({
  username: "",
  password: "",
});
const isLoading = ref(false);

// Methods
const submitForm = async () => {
  try {
    isLoading.value = true;
    const result: any = await useAuth().signIn("credentials", { ...state, redirect: false });

    if (result.error) {
      throw new Error(result.error);
    }

    await navigateTo("/buildings");
  } catch (error: any) {
    console.log(error);
    // Display toast notification on error
    const msg = "الرجاء التاكد من اسم المستخدم وكلمة المرور";
    toast.add({
      description: msg,
      color: "rose",
      timeout: 10000,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-300 to-gray-300">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-6">
        <img src="@/assets/logo.svg" alt="Company Logo" class="mx-auto h-16 w-auto mb-4" />
        <h1 class="text-2xl font-semibold text-gray-800">تسجيل الدخول إلى حسابك</h1>
      </div>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <input
            type="text"
            id="username"
            name="username"
            v-model="state.username"
            placeholder="اسم المعرف"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div class="mb-4">
          <input
            type="password"
            id="password"
            name="password"
            v-model="state.password"
            placeholder="كلمة السر"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <!-- <div class="flex justify-between items-center mb-6">
          <label class="flex items-center text-sm">
            <input type="checkbox" class="mr-2 text-primary-500 focus:ring-primary-400" />
            تذكرني
          </label>
          <a href="#" class="text-sm text-primary-500 hover:underline">هل نسيت كلمة السر؟</a>
        </div> -->
        <UButton
          type="submit"
          :class="['w-full py-2 rounded-lg justify-center text-white', isLoading ? 'bg-gray-400' : 'bg-primary-500 hover:bg-primary-600']"
          :disabled="isLoading"
          :loading="isLoading"
          title="دخول"
        >
          {{ isLoading ? "جاري تسجيل الدخول..." : "دخول" }}
        </UButton>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  font-family: "Arial", sans-serif;
}

.bg-gradient-to-br {
  background-size: cover;
  background-position: center;
}
</style>
