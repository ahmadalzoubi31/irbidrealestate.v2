import type { Building, Flat, Maintenance, Service } from "@prisma/client";

interface FlatWithServicesAndMaintenances extends Flat {
  services: Service[];
  maintenances: Maintenance[];
}
interface BuildingWithFlat extends Building {
  flats: FlatWithServicesAndMaintenances[] | null;
}

// composables/useBuildingActions.ts
export function useBuildingActions() {
  const toast = useToast();

  const getOneBuilding = async (id: number) => {
    const { data, status, error } = await useFetch<Building>("/api/buildings/" + id, {
      key: "getBuildingById",
      server: true,
    });

    if (status.value === "error") {
      toast.add({
        description: error.value!.message || "البناية المطلوبة غير موجودة.",
        color: "rose",
        timeout: 15000,
      });
      navigateTo("/buildings");
    }

    return { data: data.value, status: status.value };
  };
  const getOneBuildingWithFlats = async (id: number, year: number) => {
    const { data, status, error } = await useFetch<BuildingWithFlat>("/api/flats/" + id, {
      key: "getBuildingWithFlatById",
      server: true,
      query: { year },
    });

    if (status.value === "error") {
      toast.add({
        description: error.value!.message || "البناية المطلوبة غير موجودة.",
        color: "rose",
        timeout: 15000,
      });
      navigateTo("/buildings");
    }

    return { data: data.value, status: status.value };
  };
  const createBuilding = async (payload: ICreateBuilding) => {
    try {
      await $fetch("/api/buildings", { method: "POST", body: payload });
      await refreshNuxtData("getBuildings");
      await navigateTo("/buildings");

      toast.add({
        description: "تم انشاء البناية بنجاح",
        color: "primary",
        timeout: 1500,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء الحفظ",
        color: "rose",
        timeout: 15000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const editBuilding = async (id: number, payload: IEditBuilding) => {
    try {
      await $fetch("/api/buildings/" + id, { method: "PUT", body: payload });
      await refreshNuxtData("getBuildings");
      await navigateTo("/buildings");

      toast.add({
        description: "تم تعديل البناية بنجاح",
        color: "primary",
        timeout: 1500,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء التعديل",
        color: "rose",
        timeout: 15000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const deleteBuilding = async (id: number) => {
    const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
    if (!confirmDelete) return;

    try {
      await $fetch("/api/buildings/" + id, { method: "DELETE", key: "deleteBuilding" });
      await refreshNuxtData("getBuildings");
      toast.add({
        description: "تم حذف البناية بنجاح",
        color: "primary",
        timeout: 1500,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء الحذف",
        color: "rose",
        timeout: 15000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };

  return { createBuilding, editBuilding, deleteBuilding, getOneBuilding, getOneBuildingWithFlats };
}
