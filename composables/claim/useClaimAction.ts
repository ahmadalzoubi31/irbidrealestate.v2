import type { Claim, ClaimDetail } from "@prisma/client";

// Extend the Claim type to include the files property
interface ClaimWithApartment extends Claim {
  Apartment: { apartmentNumber: string; ownerName: string };
  files: { purpose: string; content: { value: string } }[];
}

// composables/useClaimActions.ts
export function useClaimActions() {
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

  const getOneClaim = async (id: string) => {
    const { data, status, error } = await useFetch<ClaimWithApartment>("/api/claims/" + id, {
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
    try {
      // Separate the details and collections from the payload
      const { details, collections, ...claimData } = payload;

      // Create the claim
      const newClaim = await $fetch("/api/claims", { method: "POST", body: claimData });

      // Create Details
      const newClaimDetails = await createClaimDetail(newClaim.data.id, details);

      // Create Collections

      await refreshNuxtData("getClaims");
      await navigateTo("/claims");
      handleSuccess("تم حفظ المطالبة بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء الحفظ");
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const editClaim = async (id: string, payload: ICreateClaim, billImage: any) => {
    try {
      // update the claim
      await $fetch("/api/claims/" + id, { method: "PUT", body: payload });

      // Upload the bill image with the new claim's ID as the related ID
      if (billImage.length > 0) {
        const res: boolean = await uploadFile(billImage, "claims", id, "bill");
        if (!res) {
          // Optionally, you can delete the created claim if file upload fails
          await $fetch("/api/claims/" + id, { method: "DELETE" });
          throw new Error("تم إنشاء المطالبة ولكن فشل رفع الملفات. تم حذف المطالبة.");
        }
      }
      await refreshNuxtData("getClaims");
      await navigateTo("/claims");

      handleSuccess("تم تعديل المطالبة بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء التعديل");
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const deleteClaim = async (id: string) => {
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
  const createClaimDetail = async (id: string, payload: IDetail[]) => {
    try {
      await $fetch("/api/claims/details/" + id, { method: "POST", body: payload });
      handleSuccess("تم إضافة التفاصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء إضافة التفاصيل");
    }
  };
  const editClaimDetail = async (id: string, payload: ClaimDetail) => {
    try {
      await $fetch("/api/claims/details/" + id, { method: "PUT", body: payload });
      handleSuccess("تم تعديل التفاصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء تعديل التفاصيل");
    }
  };
  const deleteClaimDetail = async (id: string) => {
    try {
      await $fetch("/api/claims/details/" + id, { method: "DELETE" });
      handleSuccess("تم حذف التفاصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء حذف التفاصيل");
    }
  };
  const createClaimCollection = async (id: string, payload: any) => {
    try {
      await $fetch("/api/claims/" + id + "/collections", { method: "POST", body: payload });
      handleSuccess("تم إضافة التحصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء إضافة التحصيل");
    }
  };
  const editClaimCollection = async (id: string, payload: any) => {
    try {
      await $fetch("/api/claims/collections/" + id, { method: "PUT", body: payload });
      handleSuccess("تم تعديل التحصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء تعديل التحصيل");
    }
  };
  const deleteClaimCollection = async (id: string) => {
    try {
      await $fetch("/api/claims/collections/" + id, { method: "DELETE" });
      handleSuccess("تم حذف التحصيل بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء حذف التحصيل");
    }
  };
  return { createClaim, editClaim, deleteClaim, getOneClaim };
}
