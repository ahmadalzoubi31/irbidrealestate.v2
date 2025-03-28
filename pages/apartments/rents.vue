<script setup lang="ts">
// Dependencies
import type { apartment, building } from "@prisma/client";
import format from "date-fns/format";

// Interface
interface ApartmentWithBuilding extends apartment {
  building: building;
}

// State
const q = ref("");
const selectedYear = ref(new Date().getFullYear());
const selectedBuilding = ref("الكل");
const selected: Ref<ApartmentWithBuilding[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useApartmentTableColumns();

// Fetching
const { apartments, status } = useApartments();

// Computed loading state
const isLoading = computed(
  () => status.value !== "success" && status.value !== "error"
);
const activeApartments = computed(() =>
  apartments.value
    ? apartments.value.filter(
        (apartment) =>
          (apartment.rentStatus === 3 || apartment.rentStatus === 2) &&
          new Date(apartment.rentDate).getFullYear() == selectedYear.value &&
          (selectedBuilding.value === "الكل" ||
            apartment.building.name == selectedBuilding.value)
      )
    : []
);
const brokenApartments = computed(() =>
  apartments.value
    ? apartments.value.filter(
        (apartment) =>
          apartment.rentStatus === 1 &&
          new Date(apartment.rentDate).getFullYear() == selectedYear.value &&
          (selectedBuilding.value === "الكل" ||
            apartment.building.name == selectedBuilding.value)
      )
    : []
);
const expiredApartments = computed(() =>
  apartments.value
    ? apartments.value.filter(
        (apartment) =>
          apartment.rentStatus === 0 &&
          new Date(apartment.rentDate).getFullYear() == selectedYear.value &&
          (selectedBuilding.value === "الكل" ||
            apartment.building.name == selectedBuilding.value)
      )
    : []
);

// Year Filter
const years = ref([
  2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032,
  2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045,
  2046, 2047, 2048, 2049, 2050, 2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058,
  2059, 2060,
]);

// Year building
const buildingList = useState<building[]>("buildingList");

if (!buildingList.value || buildingList.value.length === 0) {
  useBuildings();
}
const buildings = computed(() => [
  "الكل",
  ...(buildingList.value.map((b) => b.name) || []),
]);

// Filtering
const filteredRows_active = useFilteredRows<ApartmentWithBuilding>(
  activeApartments,
  q,
  ["createdAt", "updatedAt"]
);

const filteredRows_broken = useFilteredRows<ApartmentWithBuilding>(
  brokenApartments,
  q,
  ["createdAt", "updatedAt"]
);

const filteredRows_expired = useFilteredRows<ApartmentWithBuilding>(
  expiredApartments,
  q,
  ["createdAt", "updatedAt"]
);

// Define the `openModal` function before passing it to `useApartmentActions`
const openModal = (type: string) => {
  if (type === "expired") useState("isExpiredModalOpen").value = true;
  if (type === "broken") useState("isBrokenModalOpen").value = true;
};

// Actions
const { deleteApartment, getDropdownItems } = useApartmentActions();

const select = (row: ApartmentWithBuilding) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/apartments/rents/${id}/edit`);
};

const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteApartment(selected.value[0].id);
};
</script>

<template>
  <div id="apartment">
    <div class="parentWrapper" v-if="useRoute().name === 'apartments-rents'">
      <!-- Modals -->
      <ApartmentExpiredModal :selectedApartmentId="selected[0]?.id" />
      <ApartmentBrokenModal :selectedApartmentId="selected[0]?.id" />
      <!-- <ApartmentRenewedModal :selectedApartmentId="selected[0]?.id" /> -->

      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton
            icon="i-heroicons-plus-circle-20-solid"
            label="اضافة عقار"
            :to="'/apartments/rents/create'"
          />
          <UButton
            icon="i-heroicons-minus-circle-20-solid"
            label="حذف عقار"
            :disabled="selected.length === 0"
            @click="deleteSelectedRecord"
          />
        </div>
        <div class="flex justify-between">
          <UInput class="ml-3" v-model="q" placeholder="البحث ..." />
          <USelect :options="years" v-model="selectedYear" class="ml-3" />
          <USelect
            :options="buildings"
            v-model="selectedBuilding"
            class="ml-3 w-44"
            placeholder="اختيار بناية"
          />
        </div>
      </div>

      <!-- Active Table -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-12"
      >
        <UTable
          :rows="filteredRows_active"
          :columns="selectedColumns"
          v-model="selected"
          v-model:expand="expand"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
          <template #caption>
            <caption>
              <h3 class="py-2 font-bold">العقود النشطة</h3>
            </caption>
          </template>
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <ApartmentDetails :apartment="row" />
            </div>
          </template>
          <template #apartmentNumber-data="{ row }">
            <span
              :class="['font-bold text-blue-500 dark:text-blue-400 underline']"
              @click="editSelectedRecord(row.id)"
            >
              {{ row.apartmentNumber }}
            </span>
          </template>
          <template #rentDate-data="{ row }">
            <span>
              {{ format(row.rentDate, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #rentStatus-data="{ row }">
            <span
              :class="
                row.rentStatus === 3
                  ? 'text-green-500 dark:text-green-400'
                  : 'text-blue-500 dark:text-blue-400'
              "
            >
              {{ useGetContractStatusName(row.rentStatus) }}
            </span>
          </template>
          <template #actions-data="{ row }">
            <UDropdown
              :items="getDropdownItems(row, openModal)"
              class="align-middle"
            >
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

      <!-- Broken Table -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-12"
      >
        <UTable
          :rows="filteredRows_broken"
          :columns="selectedColumns"
          v-model="selected"
          v-model:expand="expand"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
          <template #caption>
            <caption>
              <h3 class="py-2 font-bold">العقود المفسوخة</h3>
            </caption>
          </template>
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <ApartmentDetails :apartment="row" />
            </div>
          </template>
          <template #rentDate-data="{ row }">
            <span>
              {{ format(row.rentDate, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #rentStatus-data="{ row }">
            <span class="text-yellow-500 dark:text-yellow-400">
              {{ useGetContractStatusName(row.rentStatus) }}
            </span>
          </template>
        </UTable>
      </div>

      <!-- Expired Table -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-12"
      >
        <UTable
          :rows="filteredRows_expired"
          :columns="selectedColumns"
          v-model="selected"
          v-model:expand="expand"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
          <template #caption>
            <caption>
              <h3 class="py-2 font-bold">العقود المنتهية</h3>
            </caption>
          </template>
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <ApartmentDetails :apartment="row" />
            </div>
          </template>
          <template #rentDate-data="{ row }">
            <span>
              {{ format(row.rentDate, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #rentStatus-data="{ row }">
            <span class="text-red-500 dark:text-red-400">
              {{ useGetContractStatusName(row.rentStatus) }}
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
