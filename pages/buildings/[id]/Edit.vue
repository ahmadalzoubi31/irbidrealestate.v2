<script setup lang="ts">
import type { Building } from "@prisma/client";

const { editBuilding } = useBuildingActions();
const route = useRoute();

// Extract route parameter
const selectedBuildingId = ref(route.params.id as string);

// Access the shared state for buildings
const buildings = useState<Building[]>("buildingList");
// Find the specific building reactively
const building = computed(() => buildings.value?.find((el) => el.id === Number(selectedBuildingId.value)));

if (!buildings.value || buildings.value.length === 0) {
  await navigateTo("/buildings");
}

// Initialize form state with default values
interface IEditBuilding {
  apartmentsCount: number;
  storeCount: number;
  basinName: string;
  basinNumber: string;
  landNumber: string;
  electricBill: string;
  serviceAmount: number;
  maintenanceAmount: number;
}

const state = reactive<IEditBuilding>({
  apartmentsCount: 0,
  storeCount: 0,
  basinName: "",
  basinNumber: "",
  landNumber: "",
  electricBill: "",
  serviceAmount: 0,
  maintenanceAmount: 0,
});

// Reactively update the form state when `building` becomes available
watchEffect(() => {
  if (building.value) {
    state.apartmentsCount = building.value.apartmentsCount;
    state.storeCount = building.value.storeCount;
    state.basinName = building.value.basinName;
    state.basinNumber = building.value.basinNumber;
    state.landNumber = building.value.landNumber;
    state.serviceAmount = building.value.serviceAmount;
    state.maintenanceAmount = building.value.maintenanceAmount;
    state.electricBill = building.value.electricBill ?? "";
  }
});

// Handle form submission
const submitForm = async () => {
  useLoadingIndicator().start();
  await editBuilding(selectedBuildingId.value, state);
};
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <!-- Form Header -->
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>

    <!-- Form Fields -->
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- Building Name (readonly) -->
        <div class="col-span-6 sm:col-span-2">
          <label for="buildingName">اسم البناية</label>
          <UInput
            id="buildingName"
            inputClass="bg-gray-200"
            name="buildingName"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :modelValue="building?.name"
          />
        </div>

        <!-- Apartments Count -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentsCount">عدد الشقق في البناية <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="apartmentsCount" name="apartmentsCount" :type="'number'" :size="'sm'" :required="true" v-model="state.apartmentsCount" />
        </div>

        <!-- Store Count -->
        <div class="col-span-6 sm:col-span-2">
          <label for="storeCount">عدد المخازن <span class="text-sm text-primary-500">(إن وجدت)</span></label>
          <UInput id="storeCount" name="storeCount" :type="'number'" :size="'sm'" :required="false" v-model="state.storeCount" />
        </div>

        <!-- Basin Name -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinName">اسم الحوض</label>
          <UInput id="basinName" name="basinName" :size="'sm'" :required="false" v-model="state.basinName" />
        </div>

        <!-- Basin Number -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinNumber">رقم الحوض</label>
          <UInput id="basinNumber" name="basinNumber" :size="'sm'" :required="false" v-model="state.basinNumber" />
        </div>

        <!-- Land Number -->
        <div class="col-span-6 sm:col-span-2">
          <label for="landNumber">رقم قطعة الأرض</label>
          <UInput id="landNumber" name="landNumber" :size="'sm'" :required="false" v-model="state.landNumber" />
        </div>

        <!-- Service Amount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="serviceAmount">قيمة الصيانة</label>
          <UInput id="serviceAmount" name="serviceAmount" :type="'number'" :size="'sm'" :required="false" v-model="state.serviceAmount" />
        </div>

        <!-- Maintenance Amount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="maintenanceAmount">قيمة الخدمات</label>
          <UInput id="maintenanceAmount" name="maintenanceAmount" :type="'number'" :size="'sm'" :required="false" v-model="state.maintenanceAmount" />
        </div>

        <!-- Electric Bill -->
        <div class="col-span-6 sm:col-span-2">
          <label for="electricBill">رقم اشتراك الكهرباء</label>
          <UInput id="electricBill" name="electricBill" :size="'sm'" :required="false" v-model="state.electricBill" />
        </div>
      </div>
    </div>

    <!-- Form Action Buttons -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3">حفظ</UButton>
      <UButton
        :type="'button'"
        to="/buildings"
        :size="'md'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
        >إلغاء</UButton
      >
    </div>
  </form>
</template>
