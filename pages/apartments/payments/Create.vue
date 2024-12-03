<script setup lang="ts">
const toast = useToast();
import type { Apartment } from "@prisma/client";
import { addMonths, format } from "date-fns";

// Define State
const state: ICreatePayment = reactive({
  apartmentId: 0,
  nextRentDate: new Date(),
  receivedPaymentDate: new Date(),
  depositAmount: 0,
  depositDate: new Date(),
  notes: "",
});

// Get the select menu data
const { data: apartments } = useNuxtData<Apartment[]>("getApartments");
const fetchedApartments = apartments.value!.map((el) => {
  return { id: el.id, name: el.apartmentNumber };
});

// Declare Methods
const submitForm = async () => {
  const { status, error } = await useAsyncData<void, any>("createPayment", () =>
    $fetch<void>("/api/apartments/payments", {
      method: "post",
      body: state,
    })
  );

  if (status.value === "success") {
    refreshNuxtData("getPayments");
    await navigateTo("/apartments/payments");
  }

  if (status.value === "error") {
    // console.log(error.value);
    toast.add({
      title: "لقد حدث خطأ ما",
      description: error.value.data.message,
      color: "rose",
      timeout: 10000,
    });
  }
};

const fillRentAmount = computed(() => apartments.value!.find((a) => a.id == state.apartmentId)?.rentAmount);
const fillRentDate = computed(() => apartments.value!.find((a) => a.id == state.apartmentId)?.rentDate);
const fillCommissionAmount = computed(() => apartments.value!.find((a) => a.id == state.apartmentId)?.commissionAmount);
// @ts-ignore
const fillMaintenanceDiscount = computed(() => apartments.value.find((a) => a.id == state.apartmentId)?.building.maintenanceAmount);
// @ts-ignore
const fillServices = computed(() => apartments.value.find((a) => a.id == state.apartmentId)?.building.serviceAmount);

// const calculateNextRentDate = computed(() => fillRentDate.value?.toDateString());
const calculateNextRentDate = ref();
watch(fillRentDate, (newVal, oldVal) => {
  // console.log({ newVal, oldVal });
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
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
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
            :autofocus="true"
            v-model="state.apartmentId"
            :options="fetchedApartments"
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
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton
        to="/apartments/payments"
        :size="'md'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        الغاء
      </UButton>
    </div>
  </form>
</template>
