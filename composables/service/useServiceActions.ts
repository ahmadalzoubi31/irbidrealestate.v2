import type { Flat, Service } from "@prisma/client";

export const useUseServiceActions = () => {
  const toast = useToast();

  const updateServiceStatus = async (payload: Service[]) => {
    try {
      await $fetch("/api/flats/services/update", {
        method: "PUT",
        body: payload,
      });
      await refreshNuxtData("getBuildingWithFlatById");
      window.location.reload();

      toast.add({
        description: "تم تعديل الجدول بنجاح",
        color: "primary",
        timeout: 5000,
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

  return { updateServiceStatus };
};
