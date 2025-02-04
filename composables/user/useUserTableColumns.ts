// composables/useTableColumns.ts
export function useUserTableColumns() {
  const columns = [
    { key: "select", class: "w-2" },
    { key: "id", label: "رقم المستخدم", sortable: true },
    { key: "firstName", label: "الاسم الاول", sortable: false },
    { key: "lastName", label: "الاسم الثاني", sortable: false },
    { key: "username", label: "اسم المعرف", sortable: false },
    { key: "role", label: "الصلاحيات", sortable: false },
    { key: "status", label: "الحالة", sortable: true },
  ];
  const selectedColumns = ref([...columns]);

  return { columns, selectedColumns };
}
