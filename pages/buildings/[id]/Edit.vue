<script setup lang="ts">
import type { Building } from "@prisma/client";

const { getOneBuilding, editBuilding } = useBuildingActions();
const route = useRoute();

// Extract route parameter
const selectedBuildingId = ref(Number(route.params.id));

const { data: building, status } = await getOneBuilding(selectedBuildingId.value);

const state: IEditBuilding = reactive({
  name: "",
  apartmentsCount: 0,
  storeCount: 0,
  basinName: "",
  basinNumber: "",
  landNumber: "",
  electricBill: "",
  waterBill: "",
  serviceAmount: 0,
  servicePaidBy: "المالك",
  serviceTerm: "شهري",
  maintenanceAmount: 0,
  maintenancePaidBy: "المالك",
  maintenanceTerm: "شهري",
  realLocation: "",
});

// Reactively update the form state when `building` becomes available
watchEffect(() => {
  if (building) {
    state.name = building.name;
    state.apartmentsCount = building.apartmentsCount;
    state.storeCount = building.storeCount;
    state.basinName = building.basinName;
    state.basinNumber = building.basinNumber;
    state.landNumber = building.landNumber;
    state.serviceAmount = building.serviceAmount;
    state.servicePaidBy = building.servicePaidBy;
    state.serviceTerm = building.serviceTerm;
    state.maintenanceAmount = building.maintenanceAmount;
    state.maintenancePaidBy = building.maintenancePaidBy;
    state.maintenanceTerm = building.maintenanceTerm;
    state.electricBill = building.electricBill ?? "";
    state.realLocation = building.realLocation ?? "";
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
        <!-- buildingName (readonly) -->
        <div class="col-span-6 sm:col-span-2">
          <label for="buildingName">اسم البناية</label>
          <UInput id="buildingName" name="buildingName" :size="'sm'" :required="true" v-model="state.name" />
        </div>

        <!-- apartmentsCount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentsCount">عدد الشقق في البناية <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="apartmentsCount" name="apartmentsCount" :type="'number'" :size="'sm'" :required="true" v-model="state.apartmentsCount" />
        </div>

        <!-- storeCount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="storeCount">عدد المخازن <span class="text-sm text-primary-500">(إن وجدت)</span></label>
          <UInput id="storeCount" name="storeCount" :type="'number'" :size="'sm'" :required="false" v-model="state.storeCount" />
        </div>

        <!-- basinName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinName">اسم الحوض</label>
          <UInput id="basinName" name="basinName" :size="'sm'" :required="false" v-model="state.basinName" />
        </div>

        <!-- basinNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinNumber">رقم الحوض</label>
          <UInput id="basinNumber" name="basinNumber" :size="'sm'" :required="false" v-model="state.basinNumber" />
        </div>

        <!-- landNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="landNumber">رقم قطعة الأرض</label>
          <UInput id="landNumber" name="landNumber" :size="'sm'" :required="false" v-model="state.landNumber" />
        </div>

        <!-- electricBill -->
        <div class="col-span-6 sm:col-span-2">
          <label for="electricBill">رقم اشتراك الكهرباء</label>
          <UInput id="electricBill" name="electricBill" :size="'sm'" :required="false" v-model="state.electricBill" />
        </div>

        <!-- waterBill -->
        <div class="col-span-6 sm:col-span-2">
          <label for="waterBill">رقم اشتراك الماء</label>
          <UInput id="waterBill" name="waterBill" :size="'sm'" :required="false" v-model="state.waterBill" />
        </div>

        <!-- realLocation -->
        <div class="col-span-6 sm:col-span-2">
          <label for="realLocation"> موقع البناية الفعلي </label>
          <UInput id="realLocation" name="realLocation" :size="'sm'" :required="false" v-model="state.realLocation" />
        </div>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">صيانة البناية</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- serviceAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="serviceAmount"> قيمة الصيانة </label>
          <UInput id="serviceAmount" name="serviceAmount" :type="'number'" :size="'sm'" :required="false" v-model="state.serviceAmount" />
        </div>
        <!-- servicePaidBy -->
        <div class="col-span-6 sm:col-span-2">
          <label for="servicePaidBy"> الدفع من قبل؟ </label>
          <!-- <UInput id="servicePaidBy" name="servicePaidBy" :type="'number'" :size="'sm'" :required="false" v-model="state.service.paidBy" /> -->
          <USelectMenu
            id="servicePaidBy"
            name="servicePaidBy"
            :size="'sm'"
            :required="false"
            v-model="state.servicePaidBy"
            :options="[
              { name: 'المالك', value: 'المالك' },
              { name: 'المستأجر', value: 'المستأجر' },
            ]"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- serviceTerm -->
        <div class="col-span-6 sm:col-span-2">
          <label for="serviceTerm"> مدة الدفع </label>
          <!-- <UInput id="serviceTerm" name="serviceTerm" :type="'number'" :size="'sm'" :required="false" v-model="state.service.term" /> -->
          <USelectMenu
            id="serviceTerm"
            name="serviceTerm"
            :size="'sm'"
            :required="false"
            v-model="state.serviceTerm"
            :options="[
              { name: 'شهري', value: 'شهري' },
              { name: 'سنوي', value: 'سنوي' },
            ]"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">خدمات البناية</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- maintenanceAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="maintenanceAmount"> قيمة الخدمات </label>
          <UInput id="maintenanceAmount" name="maintenanceAmount" :type="'number'" :size="'sm'" :required="false" v-model="state.maintenanceAmount" />
        </div>
        <!-- maintenancePaidBy -->
        <div class="col-span-6 sm:col-span-2">
          <label for="maintenancePaidBy"> الدفع من قبل؟ </label>
          <USelectMenu
            id="maintenancePaidBy"
            name="maintenancePaidBy"
            :size="'sm'"
            :required="false"
            v-model="state.maintenancePaidBy"
            :options="[
              { name: 'المالك', value: 'المالك' },
              { name: 'المستأجر', value: 'المستأجر' },
            ]"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- maintenanceTerm -->
        <div class="col-span-6 sm:col-span-2">
          <label for="maintenanceTerm"> مدة الدفع </label>
          <USelectMenu
            id="maintenanceTerm"
            name="maintenanceTerm"
            :size="'sm'"
            :required="false"
            v-model="state.maintenanceTerm"
            :options="[
              { name: 'شهري', value: 'شهري' },
              { name: 'سنوي', value: 'سنوي' },
            ]"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">شقق البناية</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <BuildingFlats />
    </div>

    <!-- <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">مخازن البناية</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <BuildingStores />
    </div> -->

    <!-- Form Action Buttons -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'sm'" class="w-20 text-center place-content-center ml-3">حفظ</UButton>
      <UButton
        :type="'button'"
        to="/buildings"
        :size="'sm'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        إلغاء
      </UButton>
    </div>
  </form>
</template>
