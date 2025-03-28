import type { ad } from "@prisma/client";

export function useAdActions() {
  const toast = useToast();
  const { uploadFile } = useUpload();

  const handleError = (error: any, defaultMessage: string) => {
    toast.add({
      description: error.message || defaultMessage,
      color: "rose",
      timeout: 15000,
    });
  };

  const handleSuccess = (message: string) => {
    toast.add({
      description: message,
      color: "primary",
      timeout: 1500,
    });
  };

  const uploadImages = async (images: Image[], type: string) => {
    if (images.length > 0) {
      const keys: string[] | null = await uploadFile(images, type);
      if (!keys) {
        throw new Error(`فشل رفع الملفات - ${type}`);
      }
      return keys.join(",");
    }
    return "";
  };

  const updateImages = async (
    images: Image[],
    oldKeys: string[],
    type: string
  ) => {
    if (images.length > 0) {
      if (oldKeys.length > 0) {
        await $fetch("/api/v2/files", {
          method: "DELETE",
          body: { keys: oldKeys },
        });
      }
      const keys: string[] | null = await uploadFile(images, type);
      if (!keys) {
        throw new Error(`فشل رفع الملفات - ${type}`);
      }
      return keys.join(",");
    }
    return oldKeys.join(",");
  };

  const getOneAd = async (id: string) => {
    const { data, status, error } = await useFetch<ad>("/api/ads/" + id, {
      key: "getAdById",
      server: true,
    });

    if (status.value === "error") {
      handleError(error.value, "الاعلان المطلوب غير موجود.");
      navigateTo("/ads");
    }

    return { data: data.value, status: status.value };
  };

  const createAd = async (payload: ICreateAd, files: Image[]) => {
    let imagesArray: string = "";
    try {
      imagesArray += await uploadImages(files, "ads");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء رفع الملفات");
    } finally {
      try {
        // Create the ad
        const newAd = await $fetch("/api/ads", {
          method: "POST",
          body: { ...payload, images: imagesArray },
        });
        await refreshNuxtData("getAds");
        await navigateTo("/ads");
        handleSuccess("تم انشاء الاعلان بنجاح");
      } catch (error) {
        handleError(error, "حدث خطأ أثناء الحفظ");
      } finally {
        useLoadingIndicator().finish();
      }
    }
  };

  const editAd = async (id: string, payload: IEditAd, adImages: Image[]) => {
    let imagesArray: string = "";
    const oldAdImageKeys = payload.images
      ?.split(",")
      .filter((key) => key.includes("ads"));

    try {
      if (oldAdImageKeys && oldAdImageKeys.length > 0) {
        imagesArray += await updateImages(adImages, oldAdImageKeys, "ads");
      }
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء رفع الملفات");
    } finally {
      try {
        // Update the ad details
        await $fetch("/api/ads/" + id, {
          method: "PUT",
          body: { ...payload, images: imagesArray },
        });
        await refreshNuxtData("getAds");
        await navigateTo("/ads");
        handleSuccess("تم تحديث الإعلان بنجاح");
      } catch (error) {
        handleError(error, "حدث خطأ أثناء التعديل");
      } finally {
        useLoadingIndicator().finish();
      }
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
