<script setup lang="ts">
const toast = useToast();

// Define State
const state: ICreateBuilding = reactive({
  name: "",
  apartmentsCount: 0,
  storeCount: 0,
  basinName: "",
  basinNumber: "",
  landNumber: "",
  electricBill: "",
  serviceAmount: 0,
  maintenanceAmount: 0,
});

// Declare Methods
const submitForm = async () => {
  const { status, error } = await useAsyncData<void, any>("createBuilding", () =>
    $fetch<void>("/api/buildings", {
      method: "post",
      body: state,
    })
  );

  if (status.value === "success") {
    toast.remove("saving");
    refreshNuxtData("getBuildings");
    await navigateTo("/buildings");
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
          <label for="buildingName">اسم البناية <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="buildingName" name="buildingName" :size="'sm'" :autofocus="true" :required="true" v-model="state.name" />
        </div>
        <!-- apartmentsCount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentsCount">
            عدد الشقق في البناية
            <span class="text-sm text-primary-500">(اجباري)</span>
          </label>
          <UInput id="apartmentsCount" name="apartmentsCount" :type="'number'" :size="'sm'" :required="true" v-model="state.apartmentsCount" />
        </div>
        <!-- storeCount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="storeCount"> عدد المخازن <span class="text-sm text-primary-500">(ان وجدت)</span></label>
          <UInput id="storeCount" name="storeCount" :type="'number'" :size="'sm'" :required="false" v-model="state.storeCount" />
        </div>
        <!-- basinName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinName"> اسم الحوض <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="basinName" name="basinName" :size="'sm'" :required="true" v-model="state.basinName" />
        </div>
        <!-- basinNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinNumber"> رقم الحوض <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="basinNumber" name="basinNumber" :size="'sm'" :required="true" v-model="state.basinNumber" />
        </div>
        <!-- landNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="landNumber"> رقم قطعة الارض <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="landNumber" name="landNumber" :size="'sm'" :required="true" v-model="state.landNumber" />
        </div>
        <!-- serviceAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="serviceAmount"> قيمة الصيانة </label>
          <UInput id="serviceAmount" name="serviceAmount" :type="'number'" :size="'sm'" :required="false" v-model="state.serviceAmount" />
        </div>
        <!-- maintenanceAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="maintenanceAmount"> قيمة الخدمات </label>
          <UInput id="maintenanceAmount" name="maintenanceAmount" :type="'number'" :size="'sm'" :required="false" v-model="state.maintenanceAmount" />
        </div>
        <!-- electricBill -->
        <div class="col-span-6 sm:col-span-2">
          <label for="electricBill"> رقم اشتراك الكهرباء </label>
          <UInput id="electricBill" name="electricBill" :size="'sm'" :required="false" v-model="state.electricBill" />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="float-left">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton to="/buildings" :size="'md'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"> الغاء </UButton>
    </div>
  </form>
</template>
