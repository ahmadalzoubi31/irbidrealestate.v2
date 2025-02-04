import type { Payment } from "@prisma/client";

// composables/usePaymentActions.ts
export function usePaymentActions() {
  const toast = useToast();

  const getOnePayment = async (id: number) => {
    const { data, status, error } = await useFetch<Payment>("/api/apartments/payments/" + id, {
      key: "getPaymentById",
      server: false,
      lazy: true,
    });

    if (status.value === "error") {
      toast.add({
        description: error.value!.message || "الدفعة المطلوبة غير موجودة.",
        color: "rose",
        timeout: 10000,
      });
      navigateTo("/apartments/payments");
    }

    return { data: data.value, status: status.value };
  };
  const createPayment = async (payload: ICreatePayment) => {
    try {
      await $fetch("/api/apartments/payments", { method: "POST", body: payload });
      await refreshNuxtData("getPayments");
      await navigateTo("/apartments/payments");

      toast.add({
        description: "تم انشاء الدفعة بنجاح",
        color: "primary",
        timeout: 5000,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء الحفظ",
        color: "rose",
        timeout: 10000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const editPayment = async (id: number, payload: IEditPayment) => {
    try {
      await $fetch("/api/apartments/payments/" + id, { method: "PUT", body: payload });
      await refreshNuxtData("getPayments");
      await navigateTo("/apartments/payments");

      toast.add({
        description: "تم تعديل الدفعة بنجاح",
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
  const deletePayment = async (id: number) => {
    const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
    if (!confirmDelete) return;

    try {
      await $fetch("/api/apartments/payments/" + id, { method: "DELETE", key: "deletePayment" });
      await refreshNuxtData("getPayments");
      toast.add({
        description: "تم حذف الدفعة بنجاح",
        color: "primary",
        timeout: 5000,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء الحذف",
        color: "rose",
        timeout: 10000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };

  return { createPayment, editPayment, deletePayment, getOnePayment };
}
