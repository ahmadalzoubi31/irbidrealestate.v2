// composables/useTableColumns.ts
export function useAdTableColumns() {
  const columns = [
    { key: "select", class: "w-2" },
    { key: "code", label: "رقم الاعلان", sortable: false },
    { key: "propertyStatus", label: "حالة العقار", sortable: true },
    { key: "propertyType", label: "نوع العقار", sortable: true },
    { key: "propertyOwnerName", label: "اسم صاحب العقار", sortable: false },
    { key: "propertyOwnerNumber", label: "رقم صاحب العقار", sortable: false },
    { key: "facebookLink", label: "رابط الفيسبوك", sortable: false },
    { key: "instagramLink", label: "رابط الانتسقرام", sortable: false },
    { key: "propertyLink", label: "موقع العقار", sortable: false },
    { key: "realLocation", label: "موقع العقار الفعلي", sortable: false },
    { key: "notes", label: "الملاحظات", sortable: false },
  ];
  const selectedColumns = ref([...columns]);

  return { columns, selectedColumns };
}
