<script setup lang="ts">
// Define State
const isAddModalOpen: Ref<boolean> = useState("isAddModalOpen");
const state: ICreateBuildingFlat = reactive({
  buildingId: 0,
  flatNumber: "",
  ownerName: "",
  ownerNumber: "",
  electricSub: "",
  electricCounter: "",
  waterSub: "",
  waterCounter: "",
  renterName: "",
  renterNumber: "",
  flatStatus: 1,
});

// Define props
const props = defineProps({
  selectedBuildingId: {
    type: Number,
    required: true,
  },
});

const submitForm = async () => {
  useLoadingIndicator().start();
  state.buildingId = props.selectedBuildingId;

  const toast = useToast();

  const handleError = (error: any, defaultMessage: string) => {
    toast.add({
      description: error.message || defaultMessage,
      color: "rose",
      timeout: 15000,
    });
  };

  const handleSuccess = (message: string) => {
    toast.add({
      description: message,
      color: "primary",
      timeout: 1500,
    });
  };

  try {
    // update the record
    await $fetch("/api/buildings/flats", {
      method: "POST",
      body: JSON.stringify(state),
    });
    await refreshNuxtData("getBuildingFlats");
    useState("isAddModalOpen").value = false;
    handleSuccess("تم اضافة الشقة بنجاح");
  } catch (error: any) {
    handleError(error, "حدث خطأ أثناء الحفظ");
  } finally {
    state.flatNumber = "";
    state.ownerName = "";
    state.ownerNumber = "";
    state.electricSub = "";
    state.electricCounter = "";
    state.waterSub = "";
    state.waterCounter = "";
    state.renterName = "";
    state.renterNumber = "";
    state.flatStatus = 1;
    useLoadingIndicator().finish();
  }
};

// *** Declare Menus ***
const flatStatusOptions = [
  {
    id: 1,
    name: "فارغة",
    value: 1,
  },
  {
    id: 2,
    name: "مؤجرة",
    value: 2,
  },
];
</script>

<template>
  <UModal v-model="isAddModalOpen" prevent-close>
    <form @submit.prevent="submitForm()">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">اضافة شقة جديدة</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="() => (isAddModalOpen = false)" />
          </div>
        </template>

        <div class="grid grid-cols-6 gap-x-6 gap-y-4">
          <!-- flatNumber -->
          <div class="col-span-6 sm:col-span-2">
            <label for="flatNumber">
              رقم الشقة
              <span class="text-xs text-primary-500">(اجباري)</span>
            </label>
            <UInput id="flatNumber" name="flatNumber" :type="'text'" :size="'sm'" :required="true" v-model="state.flatNumber" />
          </div>
          <!-- ownerName -->
          <div class="col-span-6 sm:col-span-2">
            <label for="ownerName"> اسم المالك <span class="text-xs text-primary-500">(اجباري)</span></label>
            <UInput id="ownerName" name="ownerName" :size="'sm'" :required="true" v-model="state.ownerName" />
          </div>
          <!-- ownerNumber -->
          <div class="col-span-6 sm:col-span-2">
            <label for="ownerNumber"> رقم المالك </label>
            <UInput id="ownerNumber" name="ownerNumber" :size="'sm'" :required="false" v-model="state.ownerNumber!" />
          </div>
          <!-- electricSub -->
          <div class="col-span-6 sm:col-span-2">
            <label for="electricSub"> رقم اشتراك الكهرباء </label>
            <UInput id="electricSub" name="electricSub" :size="'sm'" :required="false" v-model="state.electricSub!" />
          </div>
          <!-- electricCounter -->
          <div class="col-span-6 sm:col-span-2">
            <label for="electricCounter"> رقم عداد الكهرباء </label>
            <UInput id="electricCounter" name="electricCounter" :size="'sm'" :required="false" v-model="state.electricCounter!" />
          </div>
          <!-- waterSub -->
          <div class="col-span-6 sm:col-span-2">
            <label for="waterSub"> رقم اشتراك الماء </label>
            <UInput id="waterSub" name="waterSub" :size="'sm'" :required="false" v-model="state.waterSub!" />
          </div>
          <!-- waterCounter -->
          <div class="col-span-6 sm:col-span-2">
            <label for="waterCounter"> رقم عداد الماء </label>
            <UInput id="waterCounter" name="waterCounter" :size="'sm'" :required="false" v-model="state.waterCounter!" />
          </div>
          <!-- flatStatus -->
          <div class="col-span-6 sm:col-span-2">
            <label for="flatStatus">حالة الشقة <span class="text-xs text-primary-500">(اجباري)</span></label>
            <USelectMenu
              id="flatStatus"
              name="flatStatus"
              :required="true"
              v-model="state.flatStatus"
              :options="flatStatusOptions"
              value-attribute="value"
              option-attribute="name"
            />
          </div>
          <!-- renterName -->
          <div class="col-span-6 sm:col-span-2" v-if="state.flatStatus === 2">
            <label for="renterName"> الاسم المستأجر <span class="text-xs text-primary-500">(اجباري)</span></label>
            <UInput id="renterName" name="renterName" :size="'sm'" :required="true" v-model="state.renterName" />
          </div>
          <!-- renterNumber -->
          <div class="col-span-6 sm:col-span-2" v-if="state.flatStatus === 2">
            <label for="renterNumber"> رقم المستأجر </label>
            <UInput id="renterNumber" name="renterNumber" :size="'sm'" :required="false" v-model="state.renterNumber!" />
          </div>
        </div>

        <template #footer>
          <div class="text-left">
            <UButton :type="'submit'" :size="'sm'" class="w-20 text-center place-content-center"> حفظ </UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>
</template>
