import type { Apartment } from "@prisma/client";

// composables/useApartmentActions.ts
export function useApartmentActions(refreshApartments: () => void, openModal: (type: string) => void) {
    const toast = useToast();

    const editApartment = async (id: string) => {
        await navigateTo(`/apartments/rents/${id}/edit`);
    };

    const deleteApartment = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        const { error } = await useFetch<Apartment>(`/api/apartments/${id}`, { method: "DELETE", key: "deleteApartment" });

        if (error.value) {
            toast.add({
                title: "خطأ",
                description: error.value.message || "حدث خطأ أثناء الحذف",
                color: "rose",
                timeout: 6000,
            });
            return;
        }

        toast.add({
            title: "نجاح",
            description: "تم حذف العنصر بنجاح",
            color: "primary",
            timeout: 2000,
        });

        refreshApartments();
    };

    const getDropdownItems = (row: { id: string }) => [
        [
            {
                label: "تعديل",
                icon: "i-heroicons-pencil-square-20-solid",
                click: () => editApartment(row.id),
            },
        ],
        [
            { label: "فسخ", icon: "i-heroicons-document-duplicate-20-solid", click: () => openModal("broken") },
            { label: "انهاء", icon: "i-heroicons-archive-box-20-solid", click: () => openModal("expired") },
            { label: "تجديد", icon: "i-heroicons-arrow-right-circle-20-solid", click: () => openModal("renewed") },
        ],
        [
            {
                label: "مسح",
                icon: "i-heroicons-trash-20-solid",
                click: () => deleteApartment(row.id),
            },
        ],
    ];

    return { editApartment, deleteApartment, getDropdownItems };
}
