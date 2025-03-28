<script setup lang="ts">
import type { interestedPeople } from "@prisma/client";
import { useInterestedPeoples } from "~/composables/interested-people/useInterestedPeople";
import { useInterestedPeopleActions } from "~/composables/interested-people/useInterestedPeopleAction";
import { useInterestedPeopleTableColumns } from "~/composables/interested-people/useInterestedPeopleTableColumns";

// State
const q = ref("");
const selected: Ref<interestedPeople[]> = ref([]);

// Columns
const { columns, selectedColumns } = useInterestedPeopleTableColumns();

// Fetching
const { interestedPeoples, status } = useInterestedPeoples();

// Computed loading state
const isLoading = computed(
  () => status.value !== "success" && status.value !== "error"
);

// Filtering
const filteredRows = useFilteredRows<interestedPeople>(interestedPeoples, q, [
  "createdAt",
  "updatedAt",
]);

// Actions
const { deleteInterestedPeople } = useInterestedPeopleActions();

const select = (row: interestedPeople) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/interested-people/${id}/edit`);
};

const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteInterestedPeople(selected.value[0].id);
};
</script>

<template>
  <div id="interestedPeople">
    <div class="parentWrapper" v-if="useRoute().name === 'interested-people'">
      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton
            icon="i-heroicons-plus-circle-20-solid"
            label="اضافة شخص "
            :to="'/interested-people/create'"
          />
          <UButton
            icon="i-heroicons-minus-circle-20-solid"
            label="حذف شخص "
            :disabled="selected.length === 0"
            @click="deleteSelectedRecord"
          />
        </div>
        <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
      </div>

      <!-- Table -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2"
      >
        <UTable
          :rows="filteredRows"
          :columns="selectedColumns"
          v-model="selected"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
          <template #id-data="{ row }">
            <span
              :class="[
                'font-bold text-blue-500 dark:text-blue-400 underline cursor-pointer',
              ]"
              @click="editSelectedRecord(row.id)"
            >
              {{ row.id }}
            </span>
          </template>
        </UTable>
      </div>
    </div>
    <div class="childWrapper">
      <NuxtPage />
    </div>
  </div>
</template>
