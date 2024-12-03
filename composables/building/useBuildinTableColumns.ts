// composables/useTableColumns.ts
export function useBuildingTableColumns() {
    const columns = [
        { key: "name", label: "اسم البناية", sortable: true },
        { key: "apartmentsCount", label: "عدد الشقق", sortable: false },
        { key: "storeCount", label: "عدد المخازن", sortable: false },
        { key: "basinName", label: "اسم الحوض", sortable: true },
        { key: "basinNumber", label: "رقم الحوض", sortable: true },
        { key: "landNumber", label: "رقم قطعة للأرض", sortable: true },
        { key: "serviceAmount", label: "الصيانة", sortable: false },
        { key: "maintenanceAmount", label: "الخدمات", sortable: false },
        { key: "electricBill", label: "اشتراك الكهرباء", sortable: false },
        { key: "registeredApartmentsCount", label: "عدد الشقق المسجلة", sortable: false },
    ];
    const selectedColumns = ref([...columns]);

    return { columns, selectedColumns };
}
