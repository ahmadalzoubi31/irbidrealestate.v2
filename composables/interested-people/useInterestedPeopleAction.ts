import type { InterestedPeople, Flat, Maintenance, Service } from "@prisma/client";

// interface FlatWithServicesAndMaintenances extends Flat {
//   services: Service[];
//   maintenances: Maintenance[];
// }
// interface InterestedPeople extends InterestedPeople {
//   flats: FlatWithServicesAndMaintenances[] | null;
// }

// composables/useInterestedPeopleActions.ts
export function useInterestedPeopleActions() {
  const toast = useToast();

  const getOneInterestedPeople = async (id: number) => {
    const { data, status, error } = await useFetch<InterestedPeople>("/api/ads/interested-peoples/" + id, {
      key: "getInterestedPeopleById",
      server: true,
    });

    if (status.value === "error") {
      toast.add({
        description: error.value!.message || "الشخص المطلوب غير موجود.",
        color: "rose",
        timeout: 15000,
      });
      navigateTo("/interested-people");
    }

    return { data: data.value, status: status.value };
  };
  const getOneInterestedPeoples = async () => {
    const { data, status, error } = await useFetch<InterestedPeople>("/api/ads/interested-peoples/", {
      key: "getInterestedPeoples",
      server: true,
    });

    if (status.value === "error") {
      toast.add({
        description: error.value!.message || "الشخص المطلوب غير موجود.",
        color: "rose",
        timeout: 15000,
      });
      navigateTo("/interested-people");
    }

    return { data: data.value, status: status.value };
  };
  const createInterestedPeople = async (payload: any) => {
    try {
      await $fetch("/api/ads/interested-peoples", { method: "POST", body: payload });
      await refreshNuxtData("getInterestedPeoples");
      await navigateTo("/interested-people");

      toast.add({
        description: "تم انشاء الشخص بنجاح",
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
  const editInterestedPeople = async (id: number, payload: any) => {
    try {
      await $fetch("/api/ads/interested-peoples/" + id, { method: "PUT", body: payload });
      await refreshNuxtData("getInterestedPeoples");
      await navigateTo("/interested-people");

      toast.add({
        description: "تم تعديل الشخص بنجاح",
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
  const deleteInterestedPeople = async (id: number) => {
    const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
    if (!confirmDelete) return;

    try {
      await $fetch("/api/ads/interested-peoples/" + id, { method: "DELETE", key: "deleteInterestedPeople" });
      await refreshNuxtData("getInterestedPeoples");
      toast.add({
        description: "تم حذف الشخص بنجاح",
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

  return { createInterestedPeople, editInterestedPeople, deleteInterestedPeople, getOneInterestedPeople, getOneInterestedPeoples };
}
