// composables/useTableColumns.ts
export function useOrderTableColumns() {
    const columns = [
        {key: 'select', class: 'w-2'},
        { key: "id", label: "رقم الطلب", sortable: false },
        { key: "type", label: "نوع الطلب", sortable: true },
        { key: "date", label: "تاريخ الطلب", sortable: false },
        { key: "ownerName", label: "اسم صاحب الطلب", sortable: false },
        { key: "ownerNumber", label: "رقم صاحب الطلب", sortable: false },
        { key: "price", label: "السعر", sortable: true },
        { key: "status", label: "الحالة", sortable: true },
    ];
    const selectedColumns = ref([...columns]);

    return { columns, selectedColumns };
}
