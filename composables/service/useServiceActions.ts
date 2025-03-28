import type { flat, service } from "@prisma/client";

export const useUseServiceActions = () => {
  const toast = useToast();

  const updateServiceStatus = async (payload: service[]) => {
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

  return { updateServiceStatus };
};
