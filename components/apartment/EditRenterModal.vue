<script setup lang="ts">
// Types
interface RenterState {
  renterName: string;
  renterNumber: string;
  renterNationality: string;
  renterCountry: string | null;
  renterIdentification: string;
  identificationImage: Image | string;
  contractImage: Image | string;
}

// Composables
const isEditRenterModalOpen = useState<boolean>("isEditRenterModalOpen");
const selectedDetailRow = useState<RenterState>("selectedDetailRow");
const selectedDetailIndex = useState<number>("selectedDetailIndex");
const { handleFileInput: handle2, files: renterIdentificationImage } = useFileStorage({ clearOldFiles: true });
const { handleFileInput: handle3, files: contractImage } = useFileStorage({ clearOldFiles: true });

// State
const state: RenterState = reactive<RenterState>({
  renterName: "",
  renterNumber: "",
  renterNationality: "اردني",
  renterCountry: "",
  renterIdentification: "",
  identificationImage: "",
  contractImage: "",
});

// Emits
const emit = defineEmits(["submitEditForm"]);

// Methods
const resetForm = () => {
  Object.assign(state, {
    renterName: "",
    renterNumber: "",
    renterNationality: "اردني",
    renterCountry: "",
    renterIdentification: "",
    identificationImage: null,
    contractImage: null,
  });
  // Reset file input if needed
  if (renterIdentificationImage.value) renterIdentificationImage.value = [];
  if (contractImage.value) contractImage.value = [];
};
const renterNationalityOptions = [
  { id: 1, name: "اردني", value: "اردني" },
  { id: 2, name: "غير اردني", value: "غير اردني" },
];

const submitForm = async () => {
  state.contractImage = contractImage.value[0];
  state.identificationImage = renterIdentificationImage.value[0];

  // Create manual copy (File objects can't be cloned)
  const formCopy = {
    ...state,
    contractImage: state.contractImage, // File reference (safe to pass)
    identificationImage: state.identificationImage, // File reference (safe to pass)
  };

  emit("submitEditForm", formCopy, selectedDetailIndex.value); // Send the state to Info.vue
  isEditRenterModalOpen.value = false;
  resetForm();
};

watchEffect(() => {
  if (selectedDetailRow.value) {
    state.renterName = selectedDetailRow.value.renterName;
    state.renterNumber = selectedDetailRow.value.renterNumber;
    state.renterNationality = selectedDetailRow.value.renterNationality;
    state.renterCountry = selectedDetailRow.value.renterCountry;
    state.renterIdentification = selectedDetailRow.value.renterIdentification;
    state.identificationImage = selectedDetailRow.value.identificationImage;
    state.contractImage = selectedDetailRow.value.contractImage;
  }
});
</script>

<template>
  <UModal v-model="isEditRenterModalOpen" prevent-close>
    <form @submit.prevent="submitForm">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">اضافة مستأجر جديدة</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="() => (isEditRenterModalOpen = false)" />
          </div>
        </template>

        <div class="grid grid-cols-6 gap-x-6 gap-y-4">
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
          <!-- renterNationality -->
          <div class="col-span-6 sm:col-span-2">
            <label for="renterNationality"> الجنسية </label>
            <USelectMenu
              id="renterNationality"
              name="renterNationality"
              :required="false"
              v-model="state.renterNationality"
              :options="renterNationalityOptions"
              value-attribute="value"
              option-attribute="name"
            />
          </div>
          <!-- renterIdentification -->
          <div class="col-span-6 sm:col-span-2">
            <label for="renterIdentification" v-if="state.renterNationality == 'اردني'"> الرقم الوطني </label>
            <label for="renterIdentification" v-else> رقم جواز السفر </label>
            <UInput id="renterIdentification" name="renterIdentification" :size="'sm'" :required="false" v-model="state.renterIdentification" />
          </div>
          <!-- renterCountry -->
          <div class="col-span-6 sm:col-span-2" v-if="state.renterNationality !== 'اردني'">
            <label for="renterCountry"> الدولة </label>
            <UInput id="renterCountry" name="renterCountry" :size="'sm'" :required="false" v-model="state.renterCountry!" />
          </div>
          <!-- renterIdentificationImage -->
          <div class="col-span-6 sm:col-span-2">
            <label for="renterIdentificationImage"> صورة الاثبات </label>
            <UInput
              id="renterIdentificationImage"
              name="renterIdentificationImage"
              :type="'file'"
              :size="'sm'"
              :required="false"
              @input="handle2"
              icon="i-heroicons-folder"
            />
          </div>
          <!-- contractImage -->
          <div class="col-span-6 sm:col-span-2">
            <label for="contractImage"> صورة العقد </label>
            <UInput
              id="contractImage"
              name="contractImage"
              :type="'file'"
              :size="'sm'"
              :required="false"
              @input="handle3"
              icon="i-heroicons-folder"
            />
          </div>
        </div>

        <template #footer>
          <div class="text-left">
            <UButton
              :type="'submit'"
              :size="'sm'"
              :disabled="state.renterName === '' || state.renterNumber === ''"
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
