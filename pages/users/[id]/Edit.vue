<script setup lang="ts">
import type { User } from "@prisma/client";
import { useUserActions } from "~/composables/user/useUserAction";

const { editUser } = useUserActions();
const route = useRoute();

// Extract route parameter
const selectedUserId = ref(route.params.id as string);

// Access the shared state for users
const users = useState<User[]>("userList");
// Find the specific user reactively
const user = computed(() => users.value?.find((el) => el.id === selectedUserId.value));

if (!users.value || users.value.length === 0) {
  await navigateTo("/users");
}

const state = reactive<IEditUser>({
  firstName: "",
  lastName: "",
  role: "",
});

// Reactively update the form state when `user` becomes available
watchEffect(() => {
  if (user.value) {
    state.firstName = user.value.firstName;
    state.lastName = user.value.lastName;
    state.role = user.value.role;
  }
});

// Handle form submission
const submitForm = async () => {
  useLoadingIndicator().start();
  await editUser(selectedUserId.value, state);
};
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
          <UInput id="firstName" name="userName" :size="'sm'" :autofocus="true" :required="true" v-model="state.firstName" />
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
          <UInput id="username" name="username" :size="'sm'" :required="false" :disabled="true" :modelValue="user?.username" />
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
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton to="/users" :size="'md'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white">
        الغاء
      </UButton>
    </div>
  </form>
</template>
