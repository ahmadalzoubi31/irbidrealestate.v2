import type { Ad } from "@prisma/client";

// composables/useAdActions.ts
export function useAdActions() {
    const toast = useToast();

    const getOneAd = async (id: string) => {
        const { data, status, error } = await useFetch<Ad>("/api/ads/" + id, {
            key: "getAdById",
            server: false,
            lazy: true
        });

        if (status.value === 'error') {
            toast.add({
                description: error.value!.message || "الاعلان المطلوب غير موجود.",
                color: "rose",
                timeout: 10000,
            });
            navigateTo("/ads");
        }

        return { data: data.value, status: status.value }

    }
    const createAd = async (payload: ICreateAd) => {
        try {
            await $fetch("/api/ads", { method: "POST", body: payload });
            await refreshNuxtData("getAds");
            await navigateTo("/ads");

            toast.add({
                description: "تم انشاء الاعلان بنجاح",
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
    const editAd = async (id: string, payload: IEditAd) => {
        try {
            await $fetch("/api/ads/" + id, { method: "PUT", body: payload });
            await refreshNuxtData("getAds");
            await navigateTo("/ads");

            toast.add({
                description: "تم تعديل الاعلان بنجاح",
                color: "primary",
                timeout: 5000,
            });

        } catch (error: any) {
            toast.add({
                description: error || "حدث خطأ أثناء التعديل",
                color: "rose",
                timeout: 10000,
            })
        } finally {
            useLoadingIndicator().finish()
        }
    }
    const deleteAd = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        try {
            await $fetch("/api/ads/" + id, { method: "DELETE", key: "deleteAd" });
            await refreshNuxtData("getAds");
            toast.add({
                description: "تم حذف الاعلان بنجاح",
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

    return { createAd, editAd, deleteAd, getOneAd };
}
