<script setup lang="ts">
const isExpiredModalOpen: Ref<boolean> = useState("isExpiredModalOpen");

// Define State
const state: IExpireApartment = reactive({
  renterName: "",
  renterNumber: "",
});

const uploadImage = (event: any) => console.log(event);
const submitForm = () => console.log("Submitting ...");
</script>

<template>
  <UModal v-model="isExpiredModalOpen">
    <form @submit.prevent="submitForm()">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">انهاء العقد</h3>
        </template>

        <div class="grid grid-cols-4 gap-x-6 gap-y-4">
          <!-- clearanceImage -->
          <div class="col-span-6 sm:col-span-2">
            <label for="clearanceImage"> صورة المخالصة <span class="text-xs text-primary-500">(اجباري)</span></label>
            <UInput id="clearanceImage" name="clearanceImage" @input="uploadImage($event)" type="file" size="sm" :required="false" icon="i-heroicons-folder" />
          </div>
        </div>

        <template #footer>
          <div class="text-left">
            <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>
</template>
