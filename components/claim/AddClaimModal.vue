<script setup lang="ts">
// Types
interface ClaimState {
  item: string;
  price: number;
  specialPrice: number;
  dateTime: Date;
  image: Image | null;
}

// Composables
import format from "date-fns/format";
const isAddClaimModalOpen = useState<boolean>("isAddClaimModalOpen");
const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });

// State
const state: ClaimState = reactive<ClaimState>({
  item: "",
  price: 0,
  specialPrice: 0,
  dateTime: new Date(),
  image: null,
});

// Emits
const emit = defineEmits(["submitAddForm"]);

// Methods
const resetForm = () => {
  Object.assign(state, {
    item: "",
    price: 0,
    specialPrice: 0,
    dateTime: new Date(), // Fresh Date instance
    image: null,
  });
  // Reset file input if needed
  if (files.value) files.value = [];
};

const submitForm = async () => {
  console.log("Adding a new details record...");

  state.image = files.value[0] || null;

  // Create manual copy (File objects can't be cloned)
  const formCopy = {
    ...state,
    dateTime: new Date(state.dateTime), // Clone Date
    image: state.image, // File reference (safe to pass)
  };

  emit("submitAddForm", formCopy); // Send the state to Info.vue
  isAddClaimModalOpen.value = false;
  resetForm();
};
</script>

<template>
  <UModal v-model="isAddClaimModalOpen" prevent-close>
    <form @submit.prevent="submitForm">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">اضافة مادة جديدة</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="() => (isAddClaimModalOpen = false)" />
          </div>
        </template>

        <div class="grid grid-cols-6 gap-x-6 gap-y-4">
          <!-- item -->
          <label for="item" class="col-span-6 sm:col-span-1"> المادة :</label>
          <div class="col-span-6 sm:col-span-2">
            <UInput id="item" name="item" :size="'sm'" :required="false" v-model="state.item" />
          </div>
          <!-- price -->
          <label for="price" class="col-span-6 sm:col-span-1"> السعر العام :</label>
          <div class="col-span-6 sm:col-span-2">
            <UInput id="price" name="price" type="number" :size="'sm'" :required="false" v-model="state.price" />
          </div>
          <!-- specialPrice -->
          <label for="specialPrice" class="col-span-6 sm:col-span-1"> السعر الخاص :</label>
          <div class="col-span-6 sm:col-span-2">
            <UInput id="specialPrice" name="specialPrice" type="number" :size="'sm'" :required="false" v-model="state.specialPrice" />
          </div>
          <!-- dateTime -->
          <label for="dateTime" class="col-span-6 sm:col-span-1"> الوقت والتاريخ :</label>
          <div class="col-span-6 sm:col-span-2">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UInput
                icon="i-heroicons-calendar-days-20-solid"
                nam="dateTime"
                :size="'sm'"
                class="w-full"
                :model-value="format(state.dateTime, 'dd/MM/yyyy')"
              />

              <template #panel="{ close }">
                <AppDatePicker v-model="state.dateTime" is-required @close="close" />
              </template>
            </UPopover>
          </div>
          <!-- image -->
          <label for="image" class="col-span-6 sm:col-span-1"> الفاتورة :</label>
          <div class="col-span-6 sm:col-span-2">
            <UInput id="image" name="image" :type="'file'" :size="'sm'" :required="false" @input="handleFileInput" icon="i-heroicons-folder" />
          </div>
        </div>

        <template #footer>
          <div class="text-left">
            <UButton
              :type="'submit'"
              :size="'sm'"
              :disabled="state.item === '' || isNaN(state.price) || state.dateTime === undefined"
              class="w-20 text-center place-content-center"
            >
              حفظ
            </UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>
</template>
