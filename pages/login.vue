<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
// Declare Variables
const state = reactive({
  username: "",
  password: "",
});
const isLoading = ref(false);
// Declare Stores
// const _accountStore = useAccountStore();

// Declare Methods
const submitForm = async () => {
  // const supabase = useSupabaseClient();

  console.log("logging....");
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: state.username,
  //   password: state.password,
  // });
  // if (error) console.log(error);
  // console.log("🚀 ~ submitForm ~ data:", data);

  //   return await _accountStore.dispatchLoginIdentity(data);
};
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-60 w-auto" src="@/assets/logo.svg" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight color-[#8c8b8b]">تسجيل دخول الى حسابك</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="submitForm()">
        <div>
          <label for="username" class="block text-sm font-medium leading-6">رقم المعرف</label>
          <UInput id="username" name="username" :size="'md'" :autofocus="true" :required="true" :model-value="state.username" />
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6">كلمة السر</label>
            <div class="text-sm">
              <a tabindex="3" href="#" class="font-semibold text-primary-600 hover:text-primary-500">هل نسيت كلمة السر؟</a>
            </div>
          </div>

          <UInput id="password" name="password" type="password" :size="'md'" :autofocus="true" :required="true" :model-value="state.password" />
        </div>

        <UButton :type="'submit'" :size="'md'" :loading="isLoading" class="w-full text-center bg-primary-400"> دخول </UButton>
      </form>

      <!-- <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        {{ " " }}
        <a href="#" class="font-semibold leading-6 text-primary-600 hover:text-primary-500">Start a 14 day free trial</a>
      </p> -->
    </div>
  </div>
</template>
