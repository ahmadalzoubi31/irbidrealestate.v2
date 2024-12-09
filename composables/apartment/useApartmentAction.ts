import type { Apartment } from "@prisma/client";

// composables/useApartmentActions.ts
export function useApartmentActions() {
    const toast = useToast();

    const getOneApartment = async (id: string) => {
        const { data, status, error } = await useFetch<Apartment>("/api/apartments/" + id, {
            key: "getApartmentById",
            server: false,
            lazy: true
        });

        if (status.value === 'error') {
            toast.add({
                title: "خطأ",
                description: error.value!.message || "الايجار المطلوبة غير موجودة.",
                color: "rose",
                timeout: 10000,
            });
            navigateTo("/apartments");
        }

        return { data: data.value, status: status.value }

    }
    const createApartment = async (payload: ICreateApartment) => {
        try {
            await $fetch("/api/apartments", { method: "POST", body: payload });
            await refreshNuxtData("getApartments");
            await navigateTo("/apartments");

            toast.add({
                title: "نجحت العملية",
                description: "تم انشاء الايجار بنجاح",
                color: "primary",
                timeout: 5000,
            });

        } catch (error: any) {
            toast.add({
                title: "خطأ",
                description: error.message || "حدث خطأ أثناء الحفظ",
                color: "rose",
                timeout: 10000,
            })
        } finally {
            useLoadingIndicator().finish()
        }
    }
    const editApartment = async (id: string, payload: IEditApartment) => {
        try {
            await $fetch("/api/apartments/" + id, { method: "PUT", body: payload });
            await refreshNuxtData("getApartments");
            await navigateTo("/apartments");

            toast.add({
                title: "نجحت العملية",
                description: "تم تعديل الايجار بنجاح",
                color: "primary",
                timeout: 5000,
            });

        } catch (error: any) {
            toast.add({
                title: "خطأ",
                description: error.message || "حدث خطأ أثناء التعديل",
                color: "rose",
                timeout: 10000,
            })
        } finally {
            useLoadingIndicator().finish()
        }
    }
    const deleteApartment = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        try {
            await $fetch("/api/apartments/" + id, { method: "DELETE", key: "deleteApartment" });
            await refreshNuxtData("getApartments");
            toast.add({
                title: "نجحت العملية",
                description: "تم حذف الايجار بنجاح",
                color: "primary",
                timeout: 5000,
            });
        } catch (error: any) {
            toast.add({
                title: "خطأ",
                description: error.message || "حدث خطأ أثناء الحذف",
                color: "rose",
                timeout: 10000,
            });
        } finally {
            useLoadingIndicator().finish()
        }
    };

    const getDropdownItems = (row: { id: string }, openModal: (type: string) => void) => [
        [
            {
                label: "تعديل",
                icon: "i-heroicons-pencil-square-20-solid",
                click: () => navigateTo(`/buildings/${row.id}/edit`)
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

    return { createApartment, editApartment, deleteApartment, getDropdownItems };
}
