<script setup lang="ts">
const isBrokenModalOpen: Ref<boolean> = useState("isBrokenModalOpen");
const { brokeApartment } = useApartmentActions();

// Define State
const state: IBrokeApartment = reactive({
  renterName: "",
  renterNumber: "",
});

// Define props
const props = defineProps({
  selectedApartmentId: {
    type: Number,
    required: true,
    default: 0,
  },
});

const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });

const submitForm = async () => {
  useLoadingIndicator().start();
  await brokeApartment(props.selectedApartmentId, state, files.value);
};
</script>

<template>
  <UModal v-model="isBrokenModalOpen">
    <form @submit.prevent="submitForm()">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">فسخ العقد</h3>
        </template>

        <div class="grid grid-cols-4 gap-x-6 gap-y-4">
          <!-- renterName -->
          <div class="col-span-6 sm:col-span-2">
            <label for="renterName"> الاسم الكامل <span class="text-xs text-primary-500">(اجباري)</span></label>
            <UInput id="renterName" name="renterName" :size="'sm'" :required="true" v-model="state.renterName" />
          </div>
          <!-- renterNumber -->
          <div class="col-span-6 sm:col-span-2">
            <label for="renterNumber"> رقم الموبايل <span class="text-xs text-primary-500">(اجباري)</span> </label>
            <UInput id="renterNumber" name="renterNumber" :size="'sm'" :required="true" v-model="state.renterNumber" />
          </div>
          <!-- contractImage -->
          <div class="col-span-6 sm:col-span-4">
            <label for="contractImage"> صورة العقد <span class="text-xs text-primary-500">(اجباري)</span></label>
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
