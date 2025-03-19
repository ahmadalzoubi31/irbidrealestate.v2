// composables/useTableColumns.ts
export function useApartmentTableColumns() {
  const columns = [
    { key: "select", class: "w-2" },
    { key: "building.name", label: "اسم البناية", sortable: true },
    { key: "apartmentNumber", label: "رقم الشقة", sortable: true },
    { key: "ownerName", label: "اسم المالك", sortable: false },
    { key: "ownerNumber", label: "رقم المالك", sortable: false },
    { key: "rentAmount", label: "قيمة الإيجار", sortable: false },
    { key: "rentDuration", label: "مدة الإيجار", sortable: false },
    { key: "rentPaymentWay", label: "طريقة دفع الإيجار", sortable: false },
    { key: "rentDate", label: "تاريخ الإيجار", sortable: true },
    { key: "rentStatus", label: "حالة العقد", sortable: false },
    { key: "actions" },
  ];
  const selectedColumns = ref([...columns]);

  return { columns, selectedColumns };
}
