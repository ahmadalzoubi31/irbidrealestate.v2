import type { Order } from "@prisma/client";

// composables/useOrderActions.ts
export function useOrderActions() {
    const toast = useToast();

    const getOneOrder = async (id: string) => {
        const { data, status, error } = await useFetch<Order>("/api/orders/" + id, {
            key: "getOrderById",
            server: false,
            lazy: true
        });

        if (status.value === 'error') {
            toast.add({
                description: error.value!.message || "البناية المطلوبة غير موجودة.",
                color: "rose",
                timeout: 10000,
            });
            navigateTo("/orders");
        }

        return { data: data.value, status: status.value }

    }
    const createOrder = async (payload: ICreateOrder) => {
        try {
            await $fetch("/api/orders", { method: "POST", body: payload });
            await refreshNuxtData("getOrders");
            await navigateTo("/orders");

            toast.add({
                description: "تم انشاء البناية بنجاح",
                color: "primary",
                timeout: 5000,
            });

        } catch (error: any) {
            toast.add({
                description: error.message || "حدث خطأ أثناء الحفظ",
                color: "rose",
                timeout: 10000,
            })
        } finally {
            useLoadingIndicator().finish()
        }
    }
    const editOrder = async (id: string, payload: IEditOrder) => {
        try {
            await $fetch("/api/orders/" + id, { method: "PUT", body: payload });
            await refreshNuxtData("getOrders");
            await navigateTo("/orders");

            toast.add({
                description: "تم تعديل البناية بنجاح",
                color: "primary",
                timeout: 5000,
            });

        } catch (error: any) {
            toast.add({
                description: error.message || "حدث خطأ أثناء التعديل",
                color: "rose",
                timeout: 10000,
            })
        } finally {
            useLoadingIndicator().finish()
        }
    }
    const deleteOrder = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        try {
            await $fetch("/api/orders/" + id, { method: "DELETE", key: "deleteOrder" });
            await refreshNuxtData("getOrders");
            toast.add({
                description: "تم حذف البناية بنجاح",
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
            useLoadingIndicator().finish()
        }
    };

    return { createOrder, editOrder, deleteOrder, getOneOrder };
}
