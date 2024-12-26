// composables/useTableColumns.ts
export function usePaymentTableColumns() {
    const columns = [
        { key: 'select', class: 'w-2' },
        { key: "id", label: "رقم الدفعة", sortable: false },
        { key: "Apartment.Building.name", label: "اسم البناية", sortable: true },
        { key: "Apartment.apartmentNumber", label: "رقم الشقة", sortable: false },
        { key: "Apartment.rentDate", label: "تاريخ الإيجار", sortable: false },
        { key: "Apartment.rentAmount", label: "قيمة الإيجار", sortable: false },
        // { key: "Apartment.commissionAmount", label: "العمولة", sortable: false },
        // { key: "Apartment.Building..serviceAmount", label: "الصيانة", sortable: false },
        // { key: "Apartment.Building..maintenanceAmount", label: "الخدمات", sortable: false },
        { key: "receivedPaymentDate", label: "تاريخ الدفعة المستلمة", sortable: false },
        // { key: "nextRentDate", label: "تاريخ الدفعة القادمة", sortable: false },
        { key: "depositAmount", label: "صافي الايداع", sortable: false },
        { key: "depositDate", label: "تاريخ الايداع", sortable: false },
        { key: "notes", label: "ملاحظات", sortable: false },
    ];
    const selectedColumns = ref([...columns]);


    return { columns, selectedColumns };
}
