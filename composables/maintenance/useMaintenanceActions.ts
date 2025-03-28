import type { flat, maintenance } from "@prisma/client";

export const useUseMaintenanceActions = () => {
  const toast = useToast();

  const updateMaintenanceStatus = async (payload: maintenance[]) => {
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

  return { updateMaintenanceStatus };
};
