import type { Building } from "@prisma/client";

// composables/useBuildingActions.ts
export function useBuildingActions(refreshBuildings: () => void) {
    const toast = useToast();

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

        toast.add({
            title: "نجاح",
            description: "تم حذف العنصر بنجاح",
            color: "primary",
            timeout: 1000,
        });

        refreshBuildings();
    };

    return { editBuilding, deleteBuilding };
}
