import type { Flat, Maintenance } from "@prisma/client";

export const useUseMaintenanceActions = () => {
  const toast = useToast();

  const updateMaintenanceStatus = async (payload: Maintenance[]) => {
    try {
      await $fetch("/api/flats/maintenances/update", {
        method: "PUT",
        body: payload,
      });
      await refreshNuxtData("getBuildingWithFlatById");
      window.location.reload();

      toast.add({
        description: "تم تعديل الجدول بنجاح",
        color: "primary",
        timeout: 1000,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء التعديل",
        color: "rose",
        timeout: 10000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };

  return { updateMaintenanceStatus };
};
