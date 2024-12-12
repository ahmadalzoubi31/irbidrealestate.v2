<script setup lang="ts">
// *** Dependencies ***
import type { Apartment, Claim } from "@prisma/client";
import { format } from "date-fns";

// Validate the id
onBeforeMount(() => {
  const paramId: number = Number(useRoute().params.id);
  // console.log("🚀 ~ onBeforeMount ~ paramId:", paramId);
  if (!isNaN(paramId)) return;

  // Redirect to the home page
  navigateTo("/ads");
});

// *** Define Variables ***
const selectedClaimId: string = useRoute().params.id as string;
const { data: claim } = await useAsyncData<Claim, any>("getOneAd", () => $fetch<Claim>("/api/claims/" + selectedClaimId));
const toast = useToast();
const collectionData = reactive({
  dateTime: new Date(),
  payment: 0,
  notes: "",
});
const detailData = reactive({
  item: "",
  price: 0,
});
const detailItem = (row: { item: string; price: number }) => [
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () => (state.details = state.details.filter((item) => !(item.item === row.item && item.price === row.price))),
    },
  ],
];
const collectionItem = (row: { dateTime: Date; payment: number; notes: string }) => [
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () =>
        (state.collections = state.collections.filter(
          (item) => !(item.dateTime === row.dateTime && item.payment === row.payment && item.notes === row.notes)
        )),
    },
  ],
];
const state: ICreateClaim = reactive({
  apartmentId: 0,
  claimDate: new Date(),
  claimFrom: "",
  total: 0.0,
  collections: [],
  details: [],
});

// Get the select menu data
await useAsyncData<Apartment[]>("getApartments", () => $fetch<Apartment[]>("/api/apartments"));
const { data: apartments } = useNuxtData<Apartment[]>("getApartments");
const fetchedApartments = apartments.value!.map((el) => {
  return { id: el.id, name: el.apartmentNumber };
});

// *** Declare Methods ***
const submitForm = async () => {
  useLoadingIndicator().start();
  const { status, error } = await useAsyncData<void, any>("editClaim", () =>
    $fetch<void>("/api/claims/" + selectedClaimId, {
      method: "put",
      body: state,
    })
  );

  if (status.value === "success") {
    toast.remove("saving");
    useLoadingIndicator().finish();
    refreshNuxtData("getClaims");
    await navigateTo("/claims");
  }

  if (status.value === "error") {
    // console.log(error.value);
    useLoadingIndicator().finish();
    toast.add({
      title: "لقد حدث خطأ ما",
      description: error.value.data.message,
      color: "rose",
      timeout: 10000,
    });
  }
};
const addCollectionData = () => {
  // Push a new empty person object to the array
  // console.log({ interestedPersonName: interestedPersonName.value, interestedPersonNumber: interestedPersonNumber.value });
  state.collections.push({ dateTime: collectionData.dateTime, payment: collectionData.payment, notes: collectionData.notes });

  detailData.item = "";
  detailData.price = 0;
};
const addDetailData = () => {
  // Push a new empty person object to the array
  // console.log({ interestedPersonName: interestedPersonName.value, interestedPersonNumber: interestedPersonNumber.value });
  state.details.push({ item: detailData.item, price: detailData.price });

  detailData.item = "";
  detailData.price = 0;
};

// *** Validate Form Data ***
if (claim.value === null) {
  await navigateTo("/claims");
} else {
  // Fill the field with data
  state.apartmentId = claim.value.apartmentId;
  state.claimDate = claim.value.claimDate;
  state.claimFrom = claim.value.claimFrom;
  state.total = claim.value.total;
  // @ts-ignore
  state.collections = claim.value.collections;
  // @ts-ignore
  state.details = claim.value.details;
}
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- apartmentId -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentId">
            رقم الشقة
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <USelectMenu
            id="apartmentId"
            name="apartmentId"
            :required="true"
            v-model="state.apartmentId"
            :options="fetchedApartments"
            value-attribute="id"
            option-attribute="name"
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
          <label for="total">
            المبلغ الكلي
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput id="total" name="total" type="number" :size="'sm'" :required="true" v-model="state.total" />
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
        <UButton
          :type="'button'"
          :size="'md'"
          class="w-20 text-center place-content-center ml-3"
          @click="addDetailData"
          :disabled="detailData.item === '' || detailData.price === 0"
        >
          اضافة
        </UButton>
      </div>
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
        <UTable class="" :rows="state.details" :columns="[{ key: 'item', label: 'المادة' }, { key: 'price', label: 'السعر' }, { key: 'actions' }]">
          <template #actions-data="{ row }">
            <UDropdown :items="detailItem(row)" class="align-middle">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" class="h-0" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </div>

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
          :size="'md'"
          class="w-20 text-center place-content-center ml-3"
          @click="addCollectionData"
          :disabled="collectionData.dateTime === '' || collectionData.payment === 0"
        >
          اضافة
        </UButton>
      </div>
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
        <UTable
          :rows="state.collections"
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
          <template #actions-data="{ row }">
            <UDropdown :items="collectionItem(row)" class="align-middle">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" class="h-0" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton to="/claims" :size="'md'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white">
        الغاء
      </UButton>
    </div>
  </form>
</template>
