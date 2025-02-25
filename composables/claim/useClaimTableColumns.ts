// composables/useTableColumns.ts
export function useClaimTableColumns() {
  const columns = [
    { key: "select", class: "w-2" },
    { key: "claimNumber", label: "رقم المطالبة", sortable: false },
    { key: "apartmentName", label: "رقم الشقة", sortable: true },
    { key: "claimFrom", label: "المطلوب منه", sortable: false },
    { key: "claimDate", label: "تاريخ المطالبة", sortable: false },
    { key: "total", label: "مجموع المبلغ", sortable: false },
    { key: "claimStatus", label: "الحالة", sortable: true },
  ];
  const selectedColumns = ref([...columns]);

  return { columns, selectedColumns };
}
