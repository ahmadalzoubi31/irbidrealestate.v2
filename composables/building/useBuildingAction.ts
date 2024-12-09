import type { Building } from "@prisma/client";

// composables/useBuildingActions.ts
export function useBuildingActions() {
    const toast = useToast();

    const getOneBuilding = async (id: string) => {
        const { data, status, error } = await useFetch<Building>("/api/buildings/" + id, {
            key: "getBuildingById",
            server: false,
            lazy: true
        });

        if (status.value === 'error') {
            toast.add({
                title: "خطأ",
                description: error.value!.message || "البناية المطلوبة غير موجودة.",
                color: "rose",
                timeout: 10000,
            });
            navigateTo("/buildings");
        }

        return { data: data.value, status: status.value }

    }
    const createBuilding = async (payload: ICreateBuilding) => {
        try {
            await $fetch("/api/buildings", { method: "POST", body: payload });
            await refreshNuxtData("getBuildings");
            await navigateTo("/buildings");

            toast.add({
                title: "نجحت العملية",
                description: "تم انشاء البناية بنجاح",
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
    const editBuilding = async (id: string, payload: IEditBuilding) => {
        try {
            await $fetch("/api/buildings/" + id, { method: "PUT", body: payload });
            await refreshNuxtData("getBuildings");
            await navigateTo("/buildings");

            toast.add({
                title: "نجحت العملية",
                description: "تم تعديل البناية بنجاح",
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
    const deleteBuilding = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        try {
            await $fetch("/api/buildings/" + id, { method: "DELETE", key: "deleteBuilding" });
            await refreshNuxtData("getBuildings");
            toast.add({
                title: "نجحت العملية",
                description: "تم حذف البناية بنجاح",
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

    return { createBuilding, editBuilding, deleteBuilding, getOneBuilding };
}
