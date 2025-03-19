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
  await brokeApartment(props.selectedApartmentId, files.value);
};
</script>

<template>
  <UModal v-model="isBrokenModalOpen" prevent-close>
    <form @submit.prevent="submitForm()">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              فسخ العقد
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="() => (isBrokenModalOpen = false)"
            />
          </div>
        </template>

        <div class="grid grid-cols-4 gap-x-6 gap-y-4">
          <!-- clearanceImage -->
          <div class="col-span-6 sm:col-span-6">
            <label for="clearanceImage">
              صورة المخالصة
              <span class="text-xs text-primary-500">(اجباري)</span></label
            >
            <UInput
              id="clearanceImage"
              name="clearanceImage"
              :type="'file'"
              :size="'sm'"
              :required="true"
              @input="handleFileInput"
              icon="i-heroicons-folder"
            />
          </div>
        </div>

        <template #footer>
          <div class="text-left">
            <UButton
              :type="'submit'"
              :size="'sm'"
              class="w-20 text-center place-content-center ml-3"
            >
              حفظ
            </UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>
</template>
