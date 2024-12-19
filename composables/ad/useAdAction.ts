import type { Ad } from "@prisma/client";

export function useAdActions() {
    const toast = useToast();

    const handleError = (error: any, defaultMessage: string) => {
        toast.add({
            description: error.message || defaultMessage,
            color: "rose",
            timeout: 10000,
        });
    };

    const handleSuccess = (message: string) => {
        toast.add({
            description: message,
            color: "primary",
            timeout: 5000,
        });
    };

    const getOneAd = async (id: string) => {
        const { data, status, error } = await useFetch<Ad>("/api/ads/" + id, {
            key: "getAdById",
            server: true
        });

        if (status.value === 'error') {
            handleError(error.value, "الاعلان المطلوب غير موجود.");
            navigateTo("/ads");
        }

        return { data: data.value, status: status.value };
    };

    const createAd = async (payload: ICreateAd) => {
        const { files, ...adData } = payload;

        try {
            const response = await $fetch("/api/ads", { method: "POST", body: adData });
            if (response) {
                await $fetch("/api/files", { method: "POST", body: files });
            }
            await refreshNuxtData("getAds");
            await navigateTo("/ads");
            handleSuccess("تم انشاء الاعلان بنجاح");
        } catch (error: any) {
            handleError(error, "حدث خطأ أثناء الحفظ");
        } finally {
            useLoadingIndicator().finish();
        }
    };

    const editAd = async (id: string, payload: IEditAd) => {
        try {
            await $fetch("/api/ads/" + id, { method: "PUT", body: payload });
            await refreshNuxtData("getAds");
            await navigateTo("/ads");
            handleSuccess("تم تعديل الاعلان بنجاح");
        } catch (error: any) {
            handleError(error, "حدث خطأ أثناء التعديل");
        } finally {
            useLoadingIndicator().finish();
        }
    };

    const deleteAd = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        try {
            await $fetch("/api/ads/" + id, { method: "DELETE", key: "deleteAd" });
            await refreshNuxtData("getAds");
            handleSuccess("تم حذف الاعلان بنجاح");
        } catch (error: any) {
            handleError(error, "حدث خطأ أثناء الحذف");
        } finally {
            useLoadingIndicator().finish();
        }
    };

    return { createAd, editAd, deleteAd, getOneAd };
}