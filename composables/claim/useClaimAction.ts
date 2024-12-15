import type { Claim } from "@prisma/client";

// composables/useClaimActions.ts
export function useClaimActions() {
    const toast = useToast();

    const getOneClaim = async (id: string) => {
        const { data, status, error } = await useFetch<Claim>("/api/claims/" + id, {
            key: "getClaimById",
            server: false,
            lazy: true
        });

        if (status.value === 'error') {
            toast.add({
                description: error.value!.message || "المطالبة المطلوبة غير موجودة.",
                color: "rose",
                timeout: 10000,
            });
            navigateTo("/claims");
        }

        return { data: data.value, status: status.value }

    }
    const createClaim = async (payload: ICreateClaim) => {
        try {
            await $fetch("/api/claims", { method: "POST", body: payload });
            await refreshNuxtData("getClaims");
            await navigateTo("/claims");

            toast.add({
                description: "تم انشاء المطالبة بنجاح",
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
    const editClaim = async (id: string, payload: ICreateClaim) => {
        try {
            await $fetch("/api/claims/" + id, { method: "PUT", body: payload });
            await refreshNuxtData("getClaims");
            await navigateTo("/claims");

            toast.add({
                description: "تم تعديل المطالبة بنجاح",
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
    const deleteClaim = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        try {
            await $fetch("/api/claims/" + id, { method: "DELETE", key: "deleteClaim" });
            await refreshNuxtData("getClaims");
            toast.add({
                description: "تم حذف المطالبة بنجاح",
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

    return { createClaim, editClaim, deleteClaim, getOneClaim };
}
