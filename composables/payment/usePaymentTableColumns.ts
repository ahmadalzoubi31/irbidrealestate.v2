// composables/useTableColumns.ts
export function useApartmentTableColumns() {
    const columns = [
        // { key: "id", label: "#", sortable: false },
        { key: "apartment.buildingName", label: "اسم البناية", sortable: true },
        { key: "apartment.apartmentNumber", label: "رقم الشقة", sortable: false },
        { key: "apartment.rentDate", label: "تاريخ الإيجار", sortable: false },
        { key: "apartment.rentAmount", label: "قيمة الإيجار", sortable: false },
        // { key: "apartment.commissionAmount", label: "العمولة", sortable: false },
        // { key: "apartment.building.serviceAmount", label: "الصيانة", sortable: false },
        // { key: "apartment.building.maintenanceAmount", label: "الخدمات", sortable: false },
        { key: "receivedPaymentDate", label: "تاريخ الدفعة المستلمة", sortable: false },
        // { key: "nextRentDate", label: "تاريخ الدفعة القادمة", sortable: false },
        { key: "depositAmount", label: "صافي الايداع", sortable: false },
        { key: "depositDate", label: "تاريخ الايداع", sortable: false },
        { key: "notes", label: "ملاحظات", sortable: false },
    ];
    const selectedColumns = ref([...columns]);


    return { columns, selectedColumns };
}
