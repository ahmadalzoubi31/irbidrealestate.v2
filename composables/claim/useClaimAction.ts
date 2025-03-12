import type { Claim, ClaimCollection, ClaimDetail, Apartment } from "@prisma/client";

// Extend the Claim type to include the files property
interface ClaimWithDetailsAndCollections extends Claim {
  claimDetails: ClaimDetail[];
  claimCollections: ClaimCollection[];
}

// composables/useClaimActions.ts
export function useClaimActions() {
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

  const getOneClaim = async (id: number) => {
    const { data, status, error } = await useFetch<ClaimWithDetailsAndCollections>("/api/claims/" + id, {
      key: "getClaimById",
      server: true,
    });

    if (status.value === "error") {
      handleError(error.value, "حدث خطأ أثناء جلب البيانات");
      navigateTo("/claims");
    }

    return { data: data.value, status: status.value };
  };

  const createClaim = async (payload: ICreateClaim) => {
    let imagesArray: string = "";
    const { claimDetails, claimCollections, ...claimData } = payload;
    const billImage = claimDetails.filter((el) => el.image !== null).map((detail) => detail.image) as Image[];
    const claimDetailsRest = claimDetails.map(({ image, ...rest }) => rest);
    try {
      if (billImage && billImage.length > 0) {
        imagesArray += await uploadImages(billImage, "bill");
      }

      const claimDetailsData: IDetail[] = claimDetailsRest.map((detail) => ({ ...detail, image: imagesArray }));

      try {
        await $fetch("/api/claims", {
          method: "POST",
          body: {
            ...claimData,
            claimDetails: { create: claimDetailsData },
            claimCollections: { create: claimCollections },
          },
        });
        await refreshNuxtData("getClaims");
        await navigateTo("/claims");
        handleSuccess("تم انشاء المطالبة بنجاح");
      } catch (error) {
        handleError(error, "حدث خطأ أثناء الحفظ");
      }
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء رفع الملفات");
    } finally {
      useLoadingIndicator().finish();
    }
  };

  const editClaim = async (id: number, payload: ICreateClaim) => {
    let imagesArray: string = "";

    const { claimDetails, claimCollections, ...claimData } = payload;

    // fetch record that have an image need to be uploaded
    const recordWithImageNeedUpload = claimDetails.filter(
      (record) => typeof record.image === "object" && record.image !== null && "content" in record.image
    );
    const recordWithOutImage = claimDetails.filter(
      (record) => (typeof record.image === "string" && record.image !== null) || record.image === undefined
    );

    const billImage = recordWithImageNeedUpload.filter((el) => el.image !== null).map((detail) => detail.image) as Image[];

    const recordWithImageNeedUploadRest = recordWithImageNeedUpload.map(({ image, ...rest }) => rest);

    // const oldImageKeys = recordWithOutImage.map((el) => (el.image ? el.image.toString().split(":")[1] : ""));

    try {
      if (billImage && billImage.length !== 0) {
        imagesArray += await uploadFile(billImage, "bill");
      }
      const updatedRecordWithImageNeedUpload: IDetail[] = recordWithImageNeedUploadRest.map((detail) => ({ ...detail, image: imagesArray }));

      const finalClaimDetails = [...recordWithOutImage, ...updatedRecordWithImageNeedUpload];

      try {
        await $fetch("/api/claims/" + id, {
          method: "PUT",
          body: { ...claimData, claimDetails: finalClaimDetails, claimCollections },
        });
        await refreshNuxtData("getClaims");
        await navigateTo("/claims");
        handleSuccess("تم تعديل المطالبة بنجاح");
      } catch (error) {
        handleError(error, "حدث خطأ أثناء التعديل");
      }
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء الملفات");
    } finally {
      useLoadingIndicator().finish();
    }
  };

  const deleteClaim = async (id: number) => {
    const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
    if (!confirmDelete) return;

    try {
      await $fetch("/api/claims/" + id, { method: "DELETE", key: "deleteClaim" });
      await refreshNuxtData("getClaims");
      handleSuccess("تم حذف المطالبة بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء الحذف");
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const createClaimDetail = async (id: number, payload: IDetail[]) => {
    try {
      await $fetch("/api/claims/details/" + id, { method: "POST", body: payload });
      handleSuccess("تم إضافة التفاصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء إضافة التفاصيل");
    }
  };
  const editClaimDetail = async (id: number, payload: ClaimDetail) => {
    try {
      await $fetch("/api/claims/details/" + id, { method: "PUT", body: payload });
      handleSuccess("تم تعديل التفاصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء تعديل التفاصيل");
    }
  };
  const deleteClaimDetail = async (id: number) => {
    try {
      await $fetch("/api/claims/details/" + id, { method: "DELETE" });
      handleSuccess("تم حذف التفاصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء حذف التفاصيل");
    }
  };
  const createClaimCollection = async (id: number, payload: any) => {
    try {
      await $fetch("/api/claims/" + id + "/collections", { method: "POST", body: payload });
      handleSuccess("تم إضافة التحصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء إضافة التحصيل");
    }
  };
  const editClaimCollection = async (id: number, payload: any) => {
    try {
      await $fetch("/api/claims/collections/" + id, { method: "PUT", body: payload });
      handleSuccess("تم تعديل التحصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء تعديل التحصيل");
    }
  };
  const deleteClaimCollection = async (id: number) => {
    try {
      await $fetch("/api/claims/collections/" + id, { method: "DELETE" });
      handleSuccess("تم حذف التحصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء حذف التحصيل");
    }
  };
  return { createClaim, editClaim, deleteClaim, getOneClaim };
}
