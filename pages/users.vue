<script setup lang="ts">
import type { user } from "@prisma/client";
import { useUserActions } from "~/composables/user/useUserAction";
import { useUsers } from "~/composables/user/useUsers";
import { useUserTableColumns } from "~/composables/user/useUserTableColumns";

// State
const q = ref("");
const selected: Ref<user[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useUserTableColumns();

// Fetching
const { users, status } = useUsers();

// Computed loading state
const isLoading = computed(
  () => status.value !== "success" && status.value !== "error"
);

// Filtering
const filteredRows = useFilteredRows<user>(users, q, [
  "createdAt",
  "updatedAt",
]);

// Actions
const { deleteUser } = useUserActions();

const select = (row: user) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/users/${id}/edit`);
};

const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteUser(selected.value[0].id);
};
</script>

<template>
  <div id="user">
    <div class="parentWrapper" v-if="useRoute().name === 'users'">
      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton
            icon="i-heroicons-plus-circle-20-solid"
            label="اضافة مستخدم"
            :to="'/users/create'"
          />
          <UButton
            icon="i-heroicons-minus-circle-20-solid"
            label="حذف مستخدم"
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
          v-model:expand="expand"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <UserDetails :user="row" />
              <!-- {{ row }} -->
            </div>
          </template>
          <template #fullName-data="{ row }">
            <span
              :class="['font-bold text-blue-500 dark:text-blue-400 underline']"
              @click="editSelectedRecord(row.fullName)"
            >
              {{ row.fullName }}
            </span>
          </template>
          <template #role-data="{ row }">
            <span>
              {{ row.role === "admin" ? "مدير" : "مستخدم" }}
            </span>
          </template>
          <template #status-data="{ row }">
            <span>
              {{ useGetStatusName(row.status) }}
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
