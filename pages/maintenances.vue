<script setup lang="ts">
import type { Flat, Maintenance } from "@prisma/client";
import { useUseMaintenanceActions } from "~/composables/maintenance/useMaintenanceActions";

interface FlatWithServicesAndMaintenances extends Flat {
  maintenances: Maintenance[];
}

// Composables
const { getOneBuildingWithFlats } = useBuildingActions();
const { updateMaintenanceStatus } = useUseMaintenanceActions();
const { buildings: availableBuildings } = useBuildings(); // For menu options

// Data
const months = ["شهر 1", "شهر 2", "شهر 3", "شهر 4", "شهر 5", "شهر 6", "شهر 7", "شهر 8", "شهر 9", "شهر 10", "شهر 11", "شهر 12"];
const flats = ref<FlatWithServicesAndMaintenances[]>([]);
const isModifyMode = ref(false);
const isLoading = ref(true);
const computedBuildings = computed(() => availableBuildings.value?.map((el) => ({ id: el.id, name: el.name })));
const selectedBuildingId = ref(availableBuildings.value?.[0]?.id);
const selectedYear = useState(() => new Date("1/1/2025").getFullYear());
const maintenances = computed(() => flats.value.flatMap((f) => f.maintenances));
const updatedMaintenances = ref<Maintenance[]>([]);

// Watchers
watchEffect(async () => {
  isLoading.value = true;
  if (selectedBuildingId.value) {
    const result = await getOneBuildingWithFlats(selectedBuildingId.value, selectedYear.value);
    flats.value = result.data?.flats || [];
    isLoading.value = false;
  }
});

// Methods
const handlePaymentStatusChange = async (mId: number, isPaid: boolean) => {
  // find the maintenance object and update its IsPaid status
  maintenances.value
    .filter((m) => m.id === mId)
    .map((m) => {
      m.isPaid = isPaid;
      // if the user revert the action then remove the maintenance object from the updatedMaintenances array
      if (updatedMaintenances.value.find((m) => m.id === mId)) {
        updatedMaintenances.value = updatedMaintenances.value.filter((m) => m.id !== mId);
      } else {
        updatedMaintenances.value.push(m);
      }
    });
};
// Method to handle select all checkbox change
const handleSelectAllChange = (monthIndex: number, status: boolean) => {
  const isSelected = status;
  // Check if all flats for selected month are paid or not, then update the status of all flats for the selected month
  if (flats.value.every((flat) => flat.maintenances[monthIndex].isPaid === isSelected)) {
    console.log("🚀 ~ handleSelectAllChange ~ all flats are already in the same status");
    return;
  }

  flats.value.forEach((flat) => {
    flat.maintenances.forEach((maintenance) => {
      if (maintenance.month === monthIndex + 1) {
        maintenance.isPaid = isSelected;
        if (updatedMaintenances.value.find((m) => m.id === maintenance.id)) {
          updatedMaintenances.value = updatedMaintenances.value.filter((m) => m.id !== maintenance.id);
        } else {
          updatedMaintenances.value.push(maintenance);
        }
      }
    });
  });
};
const saveMaintenanceStatus = async () => {
  isLoading.value = true;
  updateMaintenanceStatus(updatedMaintenances.value);
};
</script>

<template>
  <div>
    <h1 class="text-lg my-4">تتبع دفعات الصيانة</h1>
    <div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="space-y-1">
          <label for="buildingName" class="block text-sm font-medium text-gray-700"> اسم البناية </label>
          <USelectMenu
            id="buildingName"
            name="buildingName"
            v-model="selectedBuildingId"
            :options="computedBuildings"
            value-attribute="id"
            option-attribute="name"
            class="w-full"
            placeholder="اختر البناية"
            :autofocus="true"
            :required="true"
            icon="i-heroicons-building-office-2-solid"
            :uiMenu="{ option: { size: 'text-sm' }, selected: { size: 'text-sm' } }"
          />
        </div>

        <div class="space-y-1">
          <label for="year" class="block text-sm font-medium text-gray-700"> السنة </label>
          <USelectMenu
            id="year"
            name="year"
            v-model="selectedYear"
            :options="[2025].map((el) => ({ id: el, name: el }))"
            value-attribute="id"
            option-attribute="name"
            class="w-full"
            placeholder="اختر السنة"
            :required="true"
            icon="i-heroicons-calendar-days-solid"
            :uiMenu="{ option: { size: 'text-sm' }, selected: { size: 'text-sm' } }"
          />
        </div>

        <div class="flex items-end">
          <UButton label="تعديل" :size="'sm'" class="w-20 text-center place-content-center ml-3" @click="isModifyMode = !isModifyMode" />
          <UButton
            label="حفظ"
            :loading="isLoading"
            :type="'submit'"
            :size="'sm'"
            class="w-20 text-center place-content-center ml-3"
            @click="saveMaintenanceStatus()"
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>رقم الشقة</th>
            <th v-for="(month, index) in months" :key="month">
              <UCheckbox v-if="isModifyMode" type="checkbox" @change="handleSelectAllChange(index, $event)" />
              {{ month }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!isLoading" v-for="flat in flats" :key="flat.id">
            <td>{{ flat.counter }}</td>
            <td v-for="(m, index) in flat.maintenances" :key="index" :class="{ 'not-paid': !m.isPaid }">
              <UCheckbox v-if="isModifyMode" type="checkbox" :model-value="m.isPaid" @change="handlePaymentStatusChange(m.id, !m.isPaid)" />
              {{ m.isPaid ? "تم الدفع" : "لم يتم الدفع" }}
            </td>
          </tr>
          <tr v-else>
            <td colspan="13" class="text-center">جاري التحميل...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
.not-paid {
  color: #ff0000;
}
</style>
