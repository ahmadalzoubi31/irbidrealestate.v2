<script setup lang="ts">
import type { interestedPeople } from "@prisma/client";
import { useInterestedPeopleActions } from "~/composables/interested-people/useInterestedPeopleAction";

const { getOneInterestedPeople, editInterestedPeople } =
  useInterestedPeopleActions();
const route = useRoute();

// Extract route parameter
const selectedInterestedPeopleId = ref(route.params.id as string);

const { data: interestedPeople, status } = await getOneInterestedPeople(
  selectedInterestedPeopleId.value
);

const state: ICreateInterestedPeople = reactive({
  name: "",
  number: "",
  adId: "",
});

// Reactively update the form state when `building` becomes available
watchEffect(() => {
  if (interestedPeople) {
    state.name = interestedPeople.name;
    state.number = interestedPeople.number;
    state.adId = interestedPeople.adId;
  }
});

// Handle form submission
const submitForm = async () => {
  useLoadingIndicator().start();
  await editInterestedPeople(selectedInterestedPeopleId.value, state);
};

// Get the select menu data
const { ads: availableAds } = useAds();
const computedAds = computed(() =>
  availableAds.value?.map((a) => ({ id: a.id, name: a.code }))
);
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
        <!-- ad -->
        <div class="col-span-6 sm:col-span-2">
          <label for="ad">
            ترميز الاعلان
            <span class="text-xs text-primary-500">(اجباري)</span>
          </label>
          <!-- <UInput id="ad" name="ad" :type="'text'" :size="'sm'" :required="true" v-model="state.ad" /> -->
          <USelectMenu
            id="ad"
            name="ad"
            v-model:model-value="state.adId"
            :required="true"
            :options="computedAds"
            value-attribute="id"
            option-attribute="name"
          />
        </div>
        <!-- name -->
        <div class="col-span-6 sm:col-span-2">
          <label for="name"
            >اسم الشخص
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="name"
            name="name"
            :size="'sm'"
            :autofocus="true"
            :required="true"
            v-model:model-value="state.name"
          />
        </div>
        <!-- number -->
        <div class="col-span-6 sm:col-span-2">
          <label for="number"
            >رقم الشخص
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="number"
            name="number"
            :size="'sm'"
            :autofocus="true"
            :required="true"
            v-model:model-value="state.number"
          />
        </div>
      </div>
    </div>

    <!-- Submit and Cancel Buttons -->
    <div class="text-left mb-5">
      <UButton
        :type="'submit'"
        :size="'sm'"
        class="w-20 text-center place-content-center ml-3"
      >
        حفظ
      </UButton>
      <UButton
        to="/interested-people"
        :size="'sm'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        الغاء
      </UButton>
    </div>
  </form>
</template>
