// composables/useTableColumns.ts
export function useInterestedPeopleTableColumns() {
  const columns = [
    { key: "id", label: "id", sortable: true },
    { key: "ad.code", label: "ترميز الاعلان", sortable: false },
    { key: "ad.propertyStatus", label: "حالة الاعلان", sortable: true },
    { key: "name", label: "اسم الشخص" },
    { key: "number", label: "رقم الشخص" },
    { key: "actions" },
  ];
  const selectedColumns = ref([...columns]);

  return { columns, selectedColumns };
}
