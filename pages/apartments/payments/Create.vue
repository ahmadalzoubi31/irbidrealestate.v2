<script setup lang="ts">
// *** Dependencies ***
import { addMonths, format } from "date-fns";
const toast = useToast();
const { createPayment } = usePaymentActions();

// *** Define Variables ***
const state: ICreatePayment = reactive({
  apartmentId: 0,
  nextRentDate: new Date(),
  receivedPaymentDate: new Date(),
  depositAmount: 0,
  depositDate: new Date(),
  notes: "",
});
const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });
const selectedBuildingId = ref(0);

// *** Define Methods ***
const submitForm = async () => {
  // Early validation for required fields before making the API call
  if (!selectedBuildingId || !state.apartmentId || !state.depositAmount || !state.depositDate || !state.nextRentDate || !state.receivedPaymentDate) {
    toast.add({
      description: "من فضلك أكمل جميع الحقول المطلوبة.",
      color: "yellow",
      timeout: 5000,
    });
    return;
  }
  useLoadingIndicator().start();
  await createPayment(state);
};

// Get the select menu data
const { apartments: availableApartments } = useApartments();
const computedApartments = computed(() =>
  availableApartments.value
    ?.filter((a) => a.buildingId == selectedBuildingId.value && (a.rentStatus === 2 || a.rentStatus === 3))
    .map((a) => ({ id: a.id, name: a.apartmentNumber }))
);

// Get the select menu data
const { buildings: availableBuildings } = useBuildings();
const computedBuildings = computed(() =>
  availableBuildings.value?.map((el) => {
    return { id: el.id, name: el.name };
  })
);

const fillRentAmount = computed(() => availableApartments.value?.find((a) => a.id == state.apartmentId)?.rentAmount);
const fillRentDate = computed(() => availableApartments.value?.find((a) => a.id == state.apartmentId)?.rentDate);
const fillCommissionAmount = computed(() => availableApartments.value?.find((a) => a.id == state.apartmentId)?.commissionAmount);
// @ts-ignore
const fillMaintenanceDiscount = computed(() => availableApartments.value?.find((a) => a.id == state.apartmentId)?.Building.maintenanceAmount);
// @ts-ignore
const fillServices = computed(() => availableApartments.value?.find((a) => a.id == state.apartmentId)?.Building.serviceAmount);

// const calculateNextRentDate = computed(() => fillRentDate.value?.toDateString());
const calculateNextRentDate = ref();
watch(fillRentDate, (newVal, oldVal) => {
  calculateNextRentDate.value = addMonths(newVal as Date, 1);
  state.nextRentDate = calculateNextRentDate.value;
});
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- buildingName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="buildingName" class="flex justify-between">
            <div>اسم البناية <span class="text-xs text-primary-500">(اجباري) </span></div>
          </label>
          <USelectMenu
            id="buildingName"
            name="buildingName"
            v-model="selectedBuildingId"
            :autofocus="true"
            :required="true"
            :options="computedBuildings"
            value-attribute="id"
            option-attribute="name"
          />
        </div>

        <!-- apartmentNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentNumber">
            رقم الشقة
            <span class="text-xs text-primary-500">(اجباري)</span>
          </label>
          <!-- <UInput id="apartmentNumber" name="apartmentNumber" :type="'text'" :size="'sm'" :required="true" v-model="state.apartmentNumber" /> -->
          <USelectMenu
            id="apartmentNumber"
            name="apartmentNumber"
            v-model="state.apartmentId"
            :autofocus="true"
            :required="true"
            :options="computedApartments"
            value-attribute="id"
            option-attribute="name"
          />
        </div>
        <!-- rentDate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentDate"> تاريخ الإيجار </label>
          <UInput
            id="rentDate"
            name="rentDate"
            inputClass="bg-gray-200"
            :type="'text'"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :model-value="fillRentDate ? format(new Date(fillRentDate), 'dd/MM/yyyy') : ''"
          />
        </div>
        <!-- rentAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentAmount"> قيمة الإيجار </label>
          <UInput
            id="rentAmount"
            name="rentAmount"
            inputClass="bg-gray-200"
            :type="'text'"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :model-value="fillRentAmount"
          />
        </div>
        <!-- commissionAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="commissionAmount"> العمولة </label>
          <UInput
            id="commissionAmount"
            name="commissionAmount"
            inputClass="bg-gray-200"
            :type="'text'"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :model-value="fillCommissionAmount"
          />
        </div>
        <!-- maintenanceDiscount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="maintenanceDiscount"> خصم الصيانة </label>
          <UInput
            id="maintenanceDiscount"
            name="maintenanceDiscount"
            inputClass="bg-gray-200"
            :type="'text'"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :model-value="fillMaintenanceDiscount"
          />
        </div>
        <!-- services -->
        <div class="col-span-6 sm:col-span-2">
          <label for="services"> الخدمات </label>
          <UInput
            id="services"
            name="services"
            inputClass="bg-gray-200"
            :type="'text'"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :model-value="fillServices"
          />
        </div>
        <!-- nextRentDate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="nextRentDate" class="text-primary-600"> تاريخ الدفعة القادمة </label>
          <UInput
            id="nextRentDate"
            name="nextRentDate"
            inputClass="bg-gray-200"
            :type="'text'"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :model-value="calculateNextRentDate ? format(calculateNextRentDate, 'dd/MM/yyyy') : ''"
          />
        </div>
      </div>
    </div>

    <!-- Payment Info Section -->
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات الدفعة</h3>
    </div>
    <div class="pt-2 pb-8 bg-white space-y-2">
      <!-- receivedPaymentDate + depositAmount + depositDate -->
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- receivedPaymentDate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="receivedPaymentDate">
            تاريخ الدفعة المستلمة
            <span class="text-xs text-primary-500">(اجباري)</span>
          </label>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UInput
              icon="i-heroicons-calendar-days-20-solid"
              nam="receivedPaymentDate"
              :size="'sm'"
              class="w-full"
              :model-value="format(state.receivedPaymentDate, 'dd/MM/yyyy')"
            />

            <template #panel="{ close }">
              <AppDatePicker v-model="state.receivedPaymentDate" is-required @close="close" />
            </template>
          </UPopover>
        </div>
        <!-- depositAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="depositAmount"> صافي الايداع <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="depositAmount" name="depositAmount" :type="'number'" :size="'sm'" :required="true" v-model="state.depositAmount" />
        </div>
        <!-- depositDate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="depositDate">
            تاريخ الايداع
            <span class="text-xs text-primary-500">(اجباري)</span>
          </label>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UInput
              icon="i-heroicons-calendar-days-20-solid"
              nam="depositDate"
              :size="'sm'"
              class="w-full"
              :model-value="format(state.depositDate, 'dd/MM/yyyy')"
            />

            <template #panel="{ close }">
              <AppDatePicker v-model="state.depositDate" is-required @close="close" />
            </template>
          </UPopover>
        </div>
        <!-- notes -->
        <div class="col-span-6 sm:col-span-6">
          <label for="notes"> الملاحظات </label>
          <UInput id="notes" name="notes" :type="'text'" :size="'sm'" :required="false" v-model="state.notes" />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'sm'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton
        to="/apartments/payments"
        :size="'sm'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        الغاء
      </UButton>
    </div>
  </form>
</template>
