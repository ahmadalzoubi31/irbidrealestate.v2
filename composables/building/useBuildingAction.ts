import type { Building } from "@prisma/client";

// composables/useBuildingActions.ts
export function useBuildingActions() {
    const { refreshBuildings } = useBuildings();
    const toast = useToast();

    const createBuilding = async (payload: ICreateBuilding) => {

        try {
            await $fetch("/api/buildings", { method: "POST", body: payload });
            await refreshBuildings();
        } catch (error: any) {
            if (error) {
                toast.add({
                    title: "خطأ",
                    description: error.message || "حدث خطأ أثناء الحفظ",
                    color: "rose",
                    timeout: 6000,
                })
            }
        }


    }

    const editBuilding = async (id: string) => {
        await navigateTo(`/buildings/${id}/edit`);
    };

    const deleteBuilding = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        const { error } = await useFetch<Building>(`/api/buildings/${id}`, { method: "DELETE", key: "deleteBuilding" });

        if (error.value) {
            toast.add({
                title: "خطأ",
                description: error.value.message || "حدث خطأ أثناء الحذف",
                color: "rose",
                timeout: 6000,
            });
            return;
        }

        await refreshBuildings();
        toast.add({
            title: "نجاح",
            description: "تم حذف العنصر بنجاح",
            color: "primary",
            timeout: 2000,
        });
    };

    return { createBuilding, editBuilding, deleteBuilding };
}
