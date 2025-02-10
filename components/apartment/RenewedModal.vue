<script setup lang="ts">
const isRenewedModalOpen: Ref<boolean> = useState("isRenewedModalOpen");
const { renewApartment } = useApartmentActions();

// Define State
const state: IRenewApartment = reactive({
  renterName: "",
  renterNumber: "",
});

// Define props
const props = defineProps({
  selectedApartmentId: {
    type: Number,
    required: true,
  },
});

const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });
const submitForm = async () => {
  useLoadingIndicator().start();
  await renewApartment(props.selectedApartmentId, files.value);
};
</script>

<template>
  <UModal v-model="isRenewedModalOpen">
    <form @submit.prevent="submitForm()">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">تجديد العقد</h3>
        </template>

        <div class="grid grid-cols-4 gap-x-6 gap-y-4">
          <!-- contractImage -->
          <div class="col-span-6 sm:col-span-4">
            <label for="contractImage"> صورة العقد الجديد <span class="text-xs text-primary-500">(اجباري)</span></label>
            <UInput
              id="contractImage"
              name="contractImage"
              @input="handleFileInput"
              type="file"
              size="sm"
              :required="true"
              icon="i-heroicons-folder"
            />
          </div>
        </div>

        <template #footer>
          <div class="text-left">
            <UButton :type="'submit'" :size="'sm'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>
</template>
