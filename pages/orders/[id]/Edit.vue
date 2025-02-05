<script setup lang="ts">
// *** Dependencies ***
import type { Order } from "@prisma/client";
import { format } from "date-fns";

const { getOneOrder, editOrder } = useOrderActions();
const route = useRoute();

// Extract route parameter
const selectedOrderId = ref(Number(route.params.id));

const { data: order, status } = await getOneOrder(selectedOrderId.value);

const state = reactive<IEditOrder>({
  type: 0,
  date: new Date(),
  ownerName: "",
  ownerNumber: "",
  details: "",
  price: 0.0,
  firstStep: "",
  notes: "",
});

// *** Declare Menus ***
const typeOptions = [
  {
    id: 1,
    name: "شقة سكنية للبيع",
    value: 1,
  },
  {
    id: 2,
    name: "شقة استثمارية للبيع",
    value: 2,
  },
  {
    id: 3,
    name: "شقة سكنية للايجار",
    value: 3,
  },
  {
    id: 4,
    name: "ارض للبيع",
    value: 4,
  },
  {
    id: 5,
    name: "ارض للايجار",
    value: 5,
  },
  {
    id: 6,
    name: "فيلا للبيع",
    value: 6,
  },
  {
    id: 7,
    name: "فيلا للايجار",
    value: 7,
  },
  {
    id: 8,
    name: "مزرعة للبيع",
    value: 8,
  },
  {
    id: 9,
    name: "مزرعة للايجار",
    value: 9,
  },
];

// Reactively update the form state when `order` becomes available
watchEffect(() => {
  if (order) {
    state.type = order.type;
    state.date = order.date;
    state.ownerName = order.ownerName;
    state.ownerNumber = order.ownerNumber;
    state.details = order.details;
    state.price = order.price;
    state.firstStep = order.firstStep;
    state.notes = order.notes;
  }
});

// Handle form submission
const submitForm = async () => {
  useLoadingIndicator().start();
  await editOrder(selectedOrderId.value, state);
};
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- type -->
        <div class="col-span-6 sm:col-span-2">
          <label for="type">
            نوع الطلب
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <USelectMenu
            id="type"
            name="type"
            :required="true"
            v-model="state.type"
            :options="typeOptions"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- date -->
        <div class="col-span-6 sm:col-span-2">
          <label for="date">
            تاريخ الطلب
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UInput
              icon="i-heroicons-calendar-days-20-solid"
              nam="date"
              :size="'sm'"
              class="w-full"
              :model-value="format(state.date, 'dd/MM/yyyy')"
            />

            <template #panel="{ close }">
              <AppDatePicker v-model="state.date" is-required @close="close" />
            </template>
          </UPopover>
          <!-- <UInput id="rentDate" name="rentDate" :size="'sm'" :required="true" v-model="state.rentDate" /> -->
        </div>
        <!-- ownerName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="ownerName">
            اسم صاحب الطلب
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput id="ownerName" name="ownerName" :size="'sm'" :required="true" v-model="state.ownerName" />
        </div>
        <!-- ownerNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="ownerNumber">
            رقم صاحب الطلب
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput id="ownerNumber" name="ownerNumber" :size="'sm'" :required="true" v-model="state.ownerNumber" />
        </div>
        <!-- price -->
        <div class="col-span-6 sm:col-span-2">
          <label for="price">
            السعر
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput id="price" name="price" type="number" :size="'sm'" :required="true" v-model="state.price" />
        </div>
        <!-- firstStep -->
        <div class="col-span-6 sm:col-span-2">
          <label for="firstStep"> الحركة الاولية </label>
          <UInput id="firstStep" name="firstStep" :size="'sm'" :required="false" v-model="state.firstStep!" />
        </div>
        <!-- notes -->
        <div class="col-span-6 sm:col-span-2">
          <label for="notes"> ملاحظات </label>
          <UInput id="notes" name="notes" :size="'sm'" :required="false" v-model="state.notes!" />
        </div>
        <!-- details -->
        <div class="col-span-6 sm:col-span-8">
          <label for="details">
            تفاصيل الطلب
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UTextarea id="details" name="details" :size="'sm'" :required="true" v-model="state.details" />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton to="/orders" :size="'md'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white">
        الغاء
      </UButton>
    </div>
  </form>
</template>
