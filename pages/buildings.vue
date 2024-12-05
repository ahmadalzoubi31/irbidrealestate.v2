<script setup lang="ts">
import type { Building } from "@prisma/client";

// State
const q = ref("");
const selected: Ref<Building[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useBuildingTableColumns();

// Fetching
const { buildings, status } = useBuildings();

// Computed loading state
const isLoading = computed(() => status.value !== "success" && status.value !== "error");

// Filtering
const filteredRows = useFilteredRows<Building>(buildings, q, ["createdAt", "updatedAt"]);

// Actions
const { editBuilding, deleteBuilding } = useBuildingActions();

const select = (row: Building) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await editBuilding(id);
};
const counter: Ref<number> = useState("counter");
const deleteSelectedRecord = async () => {
  console.log({ length: !selected.value.length, id: selected.value[0].id.toFixed() });

  if (!selected.value.length) return;
  await deleteBuilding(selected.value[0].id.toFixed());
};
</script>

<template>
  <div>
    Counter: {{ counter }}
    <button @click="counter++">+</button>
    <button @click="counter--">-</button>
  </div>
</template>
