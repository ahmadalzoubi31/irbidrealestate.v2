<script setup lang="ts">
// *** Dependencies ***
import { useUserActions } from "~/composables/user/useUserAction";
const toast = useToast();
const { createUser } = useUserActions();

// *** Define Variables ***
const state: ICreateUser = reactive({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  role: "",
});

const confirmPassword = ref("");
const passwordsValid = ref(false);

// *** Define Methods ***
const validatePasswords = () => {
  passwordsValid.value = state.password === confirmPassword.value;
};

const submitForm = async () => {
  useLoadingIndicator().start();
  // Early validation for required fields before making the API call
  if (!state.firstName || !state.lastName || !state.username || !state.password || !state.role) {
    toast.add({
      description: "من فضلك أكمل جميع الحقول المطلوبة.",
      color: "yellow",
      timeout: 5000,
    });
    return;
  }

  await createUser(state);
};

watchEffect(() => {
  validatePasswords();
});
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- firstName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="firstName"> الاسم الاول <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="firstName" name="buildingName" :size="'sm'" :autofocus="true" :required="true" v-model="state.firstName" />
        </div>
        <!-- lastName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="lastName">
            الاسم الثاني
            <span class="text-sm text-primary-500">(اجباري)</span>
          </label>
          <UInput id="lastName" name="lastName" :size="'sm'" :required="true" v-model="state.lastName" />
        </div>
        <!-- username -->
        <div class="col-span-6 sm:col-span-2">
          <label for="username"> اسم المعرف <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="username" name="username" :size="'sm'" :required="false" v-model="state.username" />
        </div>
        <!-- password -->
        <div class="col-span-6 sm:col-span-2">
          <label for="password"> كلمة السر <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="password" name="password" :type="'password'" :size="'sm'" :required="true" v-model="state.password" />
          <small v-if="!passwordsValid" class="text-red-500">Passwords must match and be more than 6 characters long.</small>
        </div>
        <!-- confirmPassword -->
        <div class="col-span-6 sm:col-span-2">
          <label for="confirmPassword"> تأكيد كلمة السر <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="confirmPassword" name="confirmPassword" :type="'password'" :size="'sm'" :required="true" v-model="confirmPassword" />
          <small v-if="!passwordsValid" class="text-red-500">Passwords must match and be more than 6 characters long.</small>
        </div>
        <!-- role -->
        <div class="col-span-6 sm:col-span-2">
          <label for="role"> الصلاحيات <span class="text-sm text-primary-500">(اجباري)</span></label>
          <USelectMenu
            id="role"
            name="role"
            :options="[
              { name: 'مستخدم', value: 'user' },
              { name: 'مدير', value: 'admin' },
            ]"
            value-attribute="value"
            option-attribute="name"
            :size="'sm'"
            :required="true"
            v-model="state.role"
          />
        </div>
      </div>
    </div>

    <!-- Submit and Cancel Buttons -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'sm'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton to="/users" :size="'sm'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white">
        الغاء
      </UButton>
    </div>
  </form>
</template>
