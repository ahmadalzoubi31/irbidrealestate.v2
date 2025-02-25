<script setup lang="ts">
// *** Dependencies ***
import format from "date-fns/format";
const toast = useToast();
const { createClaim } = useClaimActions();

// *** Define Variables ***
const isLoading = ref(false);
const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });
const state: ICreateClaim = reactive({
  apartmentName: "",
  claimNumber: "",
  claimDate: new Date(),
  claimFrom: "",
  total: 0.0,
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
const detailData = reactive({
  item: "",
  price: 0,
  dateTime: new Date(),
  billImage: undefined,
});
const detailItem = (row: { item: string; price: number }) => [
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () => (state.claimDetails = state.claimDetails.filter((item) => !(item.item === row.item && item.price === row.price))),
    },
  ],
];
const collectionItem = (row: { dateTime: Date; payment: number; notes: string }) => [
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () =>
        (state.claimCollections = state.claimCollections.filter(
          (item) => !(item.dateTime === row.dateTime && item.payment === row.payment && item.notes === row.notes)
        )),
    },
  ],
];
const isOpen = ref(false);
const modalData = ref("");
// *** Declare Menus ***
const claimStatusOptions = [
  {
    id: 1,
    name: "نشط",
    value: 1,
  },
  {
    id: 2,
    name: "جاهزه للتحصيل",
    value: 2,
  },
  {
    id: 3,
    name: "تمت المخالصة",
    value: 3,
  },
];

// *** Define Methods ***
const submitForm = async () => {
  // TODO: Early validation for required fields before making the API call
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
const addCollectionData = () => {
  state.claimCollections.push({ dateTime: collectionData.dateTime, payment: collectionData.payment, notes: collectionData.notes });

  collectionData.dateTime = new Date();
  collectionData.payment = 0;
  collectionData.notes = "";
};
const addDetailData = () => {
  state.claimDetails.push({ item: detailData.item, price: detailData.price, dateTime: detailData.dateTime, billImage: files.value[0] });

  detailData.item = "";
  detailData.price = 0;
  detailData.dateTime = new Date();
  detailData.billImage = undefined;
};
const fillModalPropertirs = (rowContent: string) => {
  modalData.value = rowContent;
  isOpen.value = true;
};

watch(
  () => state.claimDetails,
  (newDetails) => {
    const totalDetails = newDetails.reduce((sum, detail) => sum + detail.price, 0);
    const totalCollections = state.claimCollections.reduce((sum, collection) => sum + collection.payment, 0);
    state.total = totalDetails - totalCollections;
  },
  { deep: true }
);
watch(
  () => state.claimCollections,
  (newCollections) => {
    const totalDetails = state.claimDetails.reduce((sum, detail) => sum + detail.price, 0);
    const totalCollections = newCollections.reduce((sum, collection) => sum + collection.payment, 0);
    state.total = totalDetails - totalCollections;
  },
  { deep: true }
);

const totalPayments = computed(() => {
  return state.claimCollections.reduce((sum, c) => sum + c.payment, 0);
});
const totalPrices = computed(() => {
  return state.claimDetails.reduce((sum, d) => sum + d.price, 0);
});
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- claimNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="claimNumber"> رقم المطالبة <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="claimNumber" name="claimNumber" :size="'sm'" :required="true" v-model="state.claimNumber" />
        </div>
        <!-- apartmentName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentName">
            رقم الشقة
            <span class="text-sm text-primary-500">(اجباري)</span>
          </label>
          <UInput id="apartmentName" name="apartmentName" :size="'sm'" :required="true" v-model="state.apartmentName" />
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
              <AppDatePicker v-model="state.claimDate" is-required @close="close" />
            </template>
          </UPopover>
        </div>
        <!-- claimFrom -->
        <div class="col-span-6 sm:col-span-2">
          <label for="claimFrom">
            مطالبة مالية من السيد/السيدة
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput id="claimFrom" name="claimFrom" :size="'sm'" :required="true" v-model="state.claimFrom" />
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
        <!-- claimStatus -->
        <div class="col-span-6 sm:col-span-2">
          <label for="claimStatus">حالة المطالبة <span class="text-sm text-primary-500">(اجباري)</span></label>
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
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">تفاصيل المطالبة المالية</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid sm:flex grid-cols-1 gap-x-6 gap-y-4 items-center">
        <!-- item -->
        <label for="item" class="col-span-6 sm:col-span-1"> المادة :</label>
        <div class="col-span-6 sm:col-span-2">
          <UInput id="item" name="item" :size="'sm'" :required="false" v-model="detailData.item" />
        </div>
        <!-- price -->
        <label for="price" class="col-span-6 sm:col-span-1"> السعر :</label>
        <div class="col-span-6 sm:col-span-2">
          <UInput id="price" name="price" type="number" :size="'sm'" :required="false" v-model="detailData.price" />
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
              :model-value="format(detailData.dateTime, 'dd/MM/yyyy')"
            />

            <template #panel="{ close }">
              <AppDatePicker v-model="detailData.dateTime" is-required @close="close" />
            </template>
          </UPopover>
          <!-- <UInput id="dateTime" name="dateTime" :size="'sm'" :required="false" v-model="collectionData.dateTime" /> -->
        </div>
        <!-- billImage -->
        <label for="billImage" class="col-span-6 sm:col-span-1"> الفاتورة :</label>
        <div class="col-span-6 sm:col-span-2">
          <UInput
            id="billImage"
            name="billImage"
            :type="'file'"
            :size="'sm'"
            :required="false"
            @input="handleFileInput"
            v-model="detailData.billImage"
          />
        </div>

        <UButton
          :type="'button'"
          :size="'sm'"
          class="w-20 text-center place-content-center ml-3"
          @click="addDetailData"
          :disabled="detailData.item === '' || detailData.price === 0 || detailData.dateTime === undefined"
        >
          اضافة
        </UButton>
      </div>
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
        <UTable
          class=""
          :rows="state.claimDetails"
          :columns="[
            { key: 'item', label: 'المادة' },
            { key: 'price', label: 'السعر' },
            { key: 'dateTime', label: 'الوقت والتاريخ' },
            { key: 'billImage', label: 'الفاتورة' },
            { key: 'actions' },
          ]"
        >
          <template #billImage-data="{ row }">
            <div @click="fillModalPropertirs(row.billImage.content)" class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer">
              <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
              مشاهدة
            </div>
          </template>
          <template #dateTime-data="{ row }">
            <span>{{ format(row.dateTime, "hh:mm:ss - dd/MM/yyy") }}</span>
          </template>
          <template #price-data="{ row }">
            <span>{{ row.price + " دينار" }}</span>
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="detailItem(row)" class="align-middle">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" class="h-0" />
            </UDropdown>
          </template>
        </UTable>
      </div>
      <div class="text-right font-semibold">
        <span>المجموع الكلي للمواد: {{ totalPrices }} دينار</span>
      </div>
    </div>
    <UModal v-model="isOpen">
      <div class="p-4 w-full">
        <NuxtImg :src="modalData" sizes="100vw" />
      </div>
    </UModal>
    <!-- More Info Section -->
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">تفاصيل التحصيل</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid sm:flex grid-cols-12 gap-x-6 gap-y-4 items-center">
        <!-- dateTime -->
        <label for="dateTime" class="col-span-6 sm:col-span-1"> الوقت والتاريخ :</label>
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
              <AppDatePicker v-model="collectionData.dateTime" is-required @close="close" />
            </template>
          </UPopover>
          <!-- <UInput id="dateTime" name="dateTime" :size="'sm'" :required="false" v-model="collectionData.dateTime" /> -->
        </div>
        <!-- payment -->
        <label for="payment" class="col-span-6 sm:col-span-1"> الدفعة :</label>
        <div class="col-span-6 sm:col-span-2">
          <UInput id="payment" name="payment" type="number" :size="'sm'" :required="false" v-model="collectionData.payment" />
        </div>
        <!-- notes -->
        <label for="notes" class="col-span-6 sm:col-span-1"> الملاحظات :</label>
        <div class="col-span-6 sm:col-span-6">
          <UInput id="notes" name="notes" :size="'sm'" :required="false" v-model="collectionData.notes" />
        </div>
        <UButton
          :type="'button'"
          :size="'sm'"
          class="w-20 text-center place-content-center ml-3"
          @click="addCollectionData"
          :disabled="!collectionData.dateTime || collectionData.payment === 0"
        >
          اضافة
        </UButton>
      </div>
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
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
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" class="h-0" />
            </UDropdown>
          </template>
        </UTable>
      </div>
      <div class="text-right font-semibold">
        <span>المجموع الكلي للدفعات: {{ totalPayments }} دينار</span>
      </div>
    </div>
    <!-- More Info Section -->
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">تفاصيل المخالصة</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 items-center">
        <!-- clearanceNotes -->
        <!-- <label for="clearanceNotes" class="col-span-6 sm:col-span-1"> الملاحظات :</label> -->
        <div class="col-span-12 sm:col-span-12">
          <UTextarea id="clearanceNotes" name="clearanceNotes" :size="'sm'" :required="false" v-model="state.clearanceNotes" />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'sm'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton to="/claims" :size="'sm'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white">
        الغاء
      </UButton>
    </div>
  </form>
</template>
