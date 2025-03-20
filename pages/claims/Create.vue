<script setup lang="ts">
// *** Imports ***
import type { ClaimDetail } from "@prisma/client";
import format from "date-fns/format";

// *** Composables ***
const toast = useToast();
const { createClaim } = useClaimActions();

// *** Constants ***
const claimStatusOptions = [
  { id: 1, name: "نشط", value: 1 },
  { id: 2, name: "جاهزه للتحصيل", value: 2 },
  { id: 3, name: "تمت المخالصة", value: 3 },
];

const state = reactive<ICreateClaim>({
  apartmentName: "",
  claimNumber: "",
  claimDate: new Date(),
  claimFrom: "",
  total: 0.0,
  profit: 0.0,
  clearanceNotes: "",
  claimCollections: [],
  claimDetails: [],
  claimStatus: 1,
});

const collectionData = reactive({
  dateTime: new Date(),
  payment: 0,
  notes: "",
});

// *** Computed ***
const totalPayments = computed(() =>
  state.claimCollections.reduce(
    (sum, c) => Math.round((sum + c.payment) * 1000) / 1000,
    0
  )
);
const totalPrices = computed(() =>
  state.claimDetails.reduce(
    (sum, d) => Math.round((sum + d.price) * 1000) / 1000,
    0
  )
);

// *** Methods ***
const updateTotal = () => {
  const totalDetails = state.claimDetails.reduce(
    (sum, detail) => Math.round((sum + detail.price) * 1000) / 1000,
    0
  );
  const totalCollections = state.claimCollections.reduce(
    (sum, collection) => Math.round((sum + collection.payment) * 1000) / 1000,
    0
  );
  state.total = totalDetails - totalCollections;
};
const updateProfit = () => {
  const rowProfitDetails = state.claimDetails.reduce(
    (sum, detail) =>
      Math.round((sum + (detail.price - detail.specialPrice)) * 1000) / 1000,
    0
  );
  state.profit = rowProfitDetails;
};

const addCollectionData = () => {
  state.claimCollections.push({ ...collectionData });
  Object.assign(collectionData, {
    dateTime: new Date(),
    payment: 0,
    notes: "",
  });
};

const addDetailData = (payloadFromChildeModal: ClaimDetail[]) => {
  state.claimDetails = payloadFromChildeModal;
  console.log("The new details record has been added.");
};

const submitForm = async () => {
  if (!state.claimFrom) {
    toast.add({
      description: "من فضلك أكمل جميع الحقول المطلوبة.",
      color: "yellow",
      timeout: 5000,
    });
    return;
  }
  useLoadingIndicator().start();

  await createClaim(state);
};

const collectionItem = (row: {
  dateTime: Date;
  payment: number;
  notes: string;
}) => [
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        state.claimCollections = state.claimCollections.filter(
          (item) =>
            !(
              item.dateTime === row.dateTime &&
              item.payment === row.payment &&
              item.notes === row.notes
            )
        );
      },
    },
  ],
];

// *** Watchers ***
watch(() => state.claimDetails, updateTotal, { deep: true });
watch(() => state.claimCollections, updateTotal, { deep: true });
watch(() => state.claimDetails, updateProfit, { deep: true });
</script>

<template>
  <form
    @submit.prevent="submitForm()"
    class="relative mt-6 flex-1 px-4 sm:px-6"
  >
    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- claimNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="claimNumber">
            رقم المطالبة
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="claimNumber"
            name="claimNumber"
            :size="'sm'"
            :required="true"
            v-model="state.claimNumber"
          />
        </div>
        <!-- apartmentName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentName">
            رقم الشقة
            <span class="text-xs text-primary-500">(اجباري)</span>
          </label>
          <UInput
            id="apartmentName"
            name="apartmentName"
            :size="'sm'"
            :required="true"
            v-model="state.apartmentName"
          />
        </div>
        <!-- claimDate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="claimDate">
            تاريخ المطالبة
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UInput
              icon="i-heroicons-calendar-days-20-solid"
              name="claimDate"
              :size="'sm'"
              class="w-full"
              :model-value="format(state.claimDate, 'dd/MM/yyyy')"
            />

            <template #panel="{ close }">
              <AppDatePicker
                v-model="state.claimDate"
                is-required
                @close="close"
              />
            </template>
          </UPopover>
        </div>
        <!-- claimFrom -->
        <div class="col-span-6 sm:col-span-2">
          <label for="claimFrom">
            مطالبة مالية من السيد/السيدة
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="claimFrom"
            name="claimFrom"
            :size="'sm'"
            :required="true"
            v-model="state.claimFrom"
          />
        </div>
        <!-- total -->
        <div class="col-span-6 sm:col-span-2">
          <label for="total"> المبلغ الكلي </label>
          <UInput
            id="total"
            name="total"
            type="text"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            v-model="state.total"
          />
        </div>
        <!-- profit -->
        <div class="col-span-6 sm:col-span-2">
          <label for="profit"> المربح الكلي </label>
          <UInput
            id="profit"
            name="profit"
            type="text"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            v-model="state.profit"
          />
        </div>
        <!-- claimStatus -->
        <div class="col-span-6 sm:col-span-2">
          <label for="claimStatus"
            >حالة المطالبة
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <USelectMenu
            id="claimStatus"
            name="claimStatus"
            :required="true"
            v-model="state.claimStatus"
            :options="claimStatusOptions"
            option-attribute="name"
            value-attribute="value"
          />
        </div>
      </div>
    </div>

    <!-- Claim Info Section -->
    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">
        تفاصيل المطالبة المالية
      </h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <ClaimInfo
        @submit-add-form="addDetailData"
        :claimDetails="state.claimDetails"
      />
      <div class="text-right font-semibold">
        <span>المجموع الكلي للمواد: {{ totalPrices }} دينار</span>
      </div>
    </div>

    <!-- More Info Section -->
    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">تفاصيل التحصيل</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid sm:flex grid-cols-12 gap-x-6 gap-y-4 items-center">
        <!-- dateTime -->
        <label for="dateTime" class="col-span-6 sm:col-span-1">
          الوقت والتاريخ :</label
        >
        <div class="col-span-6 sm:col-span-2">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UInput
              icon="i-heroicons-calendar-days-20-solid"
              nam="dateTime"
              :size="'sm'"
              class="w-full"
              :model-value="format(collectionData.dateTime, 'dd/MM/yyyy')"
            />

            <template #panel="{ close }">
              <AppDatePicker
                v-model="collectionData.dateTime"
                is-required
                @close="close"
              />
            </template>
          </UPopover>
          <!-- <UInput id="dateTime" name="dateTime" :size="'sm'" :required="false" v-model="collectionData.dateTime" /> -->
        </div>
        <!-- payment -->
        <label for="payment" class="col-span-6 sm:col-span-1"> الدفعة :</label>
        <div class="col-span-6 sm:col-span-2">
          <UInput
            id="payment"
            name="payment"
            type="number"
            :size="'sm'"
            :required="false"
            v-model="collectionData.payment"
          />
        </div>
        <!-- notes -->
        <label for="notes" class="col-span-6 sm:col-span-1"> الملاحظات :</label>
        <div class="col-span-6 sm:col-span-6">
          <UInput
            id="notes"
            name="notes"
            :size="'sm'"
            :required="false"
            v-model="collectionData.notes"
          />
        </div>
        <UButton
          :type="'button'"
          :size="'sm'"
          class="w-20 text-center place-content-center ml-3"
          @click="addCollectionData"
          :disabled="
            isNaN(collectionData.payment) ||
            collectionData.payment <= 0 ||
            collectionData.dateTime === undefined
          "
        >
          اضافة
        </UButton>
      </div>
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2"
      >
        <UTable
          :rows="state.claimCollections"
          :columns="[
            { key: 'dateTime', label: 'الوقت والتاريخ' },
            { key: 'payment', label: 'الدفعة' },
            { key: 'notes', label: 'الملحظات' },
            { key: 'actions' },
          ]"
        >
          <template #dateTime-data="{ row }">
            <span>{{ format(row.dateTime, "hh:mm - dd/MM/yyy") }}</span>
          </template>
          <template #payment-data="{ row }">
            <span>{{ row.payment + " دينار" }}</span>
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="collectionItem(row)" class="align-middle">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal-20-solid"
                class="h-0"
              />
            </UDropdown>
          </template>
        </UTable>
      </div>
      <div class="text-right font-semibold">
        <span>المجموع الكلي للدفعات: {{ totalPayments }} دينار</span>
      </div>
    </div>
    <!-- More Info Section -->
    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">تفاصيل المخالصة</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 items-center">
        <!-- clearanceNotes -->
        <!-- <label for="clearanceNotes" class="col-span-6 sm:col-span-1"> الملاحظات :</label> -->
        <div class="col-span-12 sm:col-span-12">
          <UTextarea
            id="clearanceNotes"
            name="clearanceNotes"
            :size="'sm'"
            :required="false"
            v-model="state.clearanceNotes"
          />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton
        :type="'submit'"
        :size="'sm'"
        class="w-20 text-center place-content-center ml-3"
      >
        حفظ
      </UButton>
      <UButton
        to="/claims"
        :size="'sm'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        الغاء
      </UButton>
    </div>
  </form>
</template>
