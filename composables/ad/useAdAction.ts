import type { Ad } from "@prisma/client";

export function useAdActions() {
  const toast = useToast();
  const { uploadFile } = useUpload();

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
      server: true,
    });

    if (status.value === "error") {
      handleError(error.value, "الاعلان المطلوب غير موجود.");
      navigateTo("/ads");
    }

    return { data: data.value, status: status.value };
  };

  const createAd = async (payload: ICreateAd, files: any[]) => {
    try {
      // Create the ad
      const newAd = await $fetch("/api/ads", { method: "POST", body: payload });

      // Upload the files with the new ad's ID as the related ID
      if (files.length > 0) {
        const res: boolean = await uploadFile(files, "ads", newAd.data.id.toString(), "ad");

        if (!res) {
          // Optionally, you can delete the created ad if file upload fails
          await $fetch("/api/ads/" + newAd.data.id, { method: "DELETE" });
          throw new Error("تم إنشاء الإعلان ولكن فشل رفع الملفات. تم حذف الإعلان.");
        }
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
      // Separate the body form the files
      const { files, ...adData } = payload;
      // Separate new files from existing files
      const newFiles = files.filter((file) => !file.id);
      const existingFiles = files.filter((file) => file.id);

      // Update the ad details
      await $fetch("/api/ads/" + id, { method: "PUT", body: adData });

      // Handle file uploads
      if (newFiles.length > 0) {
        try {
          await uploadFile(newFiles, "ads", id, "ad");
        } catch (uploadError: any) {
          handleError(uploadError, "حدث خطأ أثناء رفع الملف");
        }
      }

      // Handle file deletions if status false
      const filesToDelete = existingFiles.filter((file) => !file.status);
      if (filesToDelete.length > 0) {
        await $fetch("/api/upload", {
          method: "DELETE",
          body: { files: filesToDelete.map((file) => file.id) },
        });
      }

      await refreshNuxtData("getAds");
      await navigateTo("/ads");
      handleSuccess("تم تحديث الإعلان بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء تحديث الإعلان");
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
