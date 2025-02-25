import type { Apartment, Building } from "@prisma/client";
import { build } from "nuxt";

// composables/useApartmentActions.ts
export function useApartmentActions() {
  const toast = useToast();
  const { uploadFile } = useUpload();

  // Extend the Apartment type to include the files property
  interface ApartmentWithFiles extends Apartment {
    files: { purpose: string; fileContent: { value: string } }[];
    Building: Building;
  }

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
      timeout: 1000,
    });
  };

  const getOneApartment = async (id: number) => {
    const { data, status, error } = await useFetch<ApartmentWithFiles>("/api/apartments/" + id, {
      key: "getApartmentById",
      server: true,
    });

    if (status.value === "error") {
      handleError(error.value, "الايجار المطلوب غير موجود.");
      navigateTo("/apartments/rents");
    }

    return { data: data.value, status: status.value };
  };
  const createApartment = async (payload: ICreateApartment, furnitureImages: any[], renterIdentificationImage: any, contractImage: any) => {
    try {
      // Create the apartment
      const newApartment = await $fetch("/api/apartments", { method: "POST", body: payload });

      // Upload the furniture images with the new apartment's ID as the related ID
      if (furnitureImages.length > 0) {
        const res: boolean = await uploadFile(furnitureImages, "apartments", newApartment.data.id, "furniture");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + newApartment.data.id, { method: "DELETE" });
          throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
        }
      }
      // Upload the renter identification image with the new apartment's ID as the related ID
      if (renterIdentificationImage.length > 0) {
        const res: boolean = await uploadFile(renterIdentificationImage, "apartments", newApartment.data.id, "renter-identification");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + newApartment.data.id, { method: "DELETE" });
          throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
        }
      }
      // Upload the contract image with the new apartment's ID as the related ID
      if (contractImage.length > 0) {
        const res: boolean = await uploadFile(contractImage, "apartments", newApartment.data.id, "contract");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + newApartment.data.id, { method: "DELETE" });
          throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
        }
      }

      await refreshNuxtData("getApartments");
      await navigateTo("/apartments/rents");
      handleSuccess("تم انشاء الايجار بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء الحفظ");
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const editApartment = async (id: number, payload: IEditApartment, furnitureImages: any[], renterIdentificationImage: any, contractImage: any) => {
    try {
      // update the apartment
      await $fetch("/api/apartments/" + id, { method: "PUT", body: payload });

      // Upload the furniture images with the new apartment's ID as the related ID
      if (furnitureImages.length > 0) {
        const res: boolean = await uploadFile(furnitureImages, "apartments", id, "furniture");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + id, { method: "DELETE" });
          throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
        }
      }
      // Upload the renter identification image with the new apartment's ID as the related ID
      if (renterIdentificationImage.length > 0) {
        const res: boolean = await uploadFile(renterIdentificationImage, "apartments", id, "renter-identification");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + id, { method: "DELETE" });
          throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
        }
      }
      // Upload the contract image with the new apartment's ID as the related ID
      if (contractImage.length > 0) {
        const res: boolean = await uploadFile(contractImage, "apartments", id, "contract");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + id, { method: "DELETE" });
          throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
        }
      }

      await refreshNuxtData("getApartments");
      await navigateTo("/apartments/rents");
      handleSuccess("تم تعديل الايجار بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء التعديل");
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const deleteApartment = async (id: number) => {
    const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
    if (!confirmDelete) return;

    try {
      await $fetch("/api/apartments/" + id, { method: "DELETE", key: "deleteApartment" });
      await refreshNuxtData("getApartments");
      handleSuccess("تم حذف الايجار بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء الحذف");
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const getDropdownItems = (row: { id: number }, openModal: (type: string) => void) => [
    [
      {
        label: "تعديل",
        icon: "i-heroicons-pencil-square-20-solid",
        click: () => navigateTo(`/apartments/rents/${row.id}/edit`),
      },
    ],
    [
      { label: "انهاء", icon: "i-heroicons-archive-box-20-solid", click: () => openModal("expired") },
      { label: "فسخ", icon: "i-heroicons-document-duplicate-20-solid", click: () => openModal("broken") },
      { label: "تجديد", icon: "i-heroicons-arrow-right-circle-20-solid", click: () => openModal("renewed") },
    ],
    // [
    //   {
    //     label: "مسح",
    //     icon: "i-heroicons-trash-20-solid",
    //     click: () => deleteApartment(row.id),
    //   },
    // ],
  ];
  const expireApartment = async (id: number, clearanceImages: any) => {
    try {
      // update the apartment
      await $fetch("/api/apartments/" + id, { method: "PUT", body: { rentStatus: 0 } });

      // Upload the furniture images with the new apartment's ID as the related ID
      if (clearanceImages.length > 0) {
        const res: boolean = await uploadFile(clearanceImages, "apartments", id, "clearance");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + id, { method: "PUT", body: { rentStatus: 3 } });
          throw new Error("فشل رفع الملفات");
        }
      }

      await refreshNuxtData("getApartments");
      useState("isExpiredModalOpen").value = false;
      handleSuccess("تم تعديل الايجار بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء التعديل");
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const brokeApartment = async (id: number, payload: IBrokeApartment, contractImages: any) => {
    try {
      // get the apartment
      const { data: apartment } = await useFetch<Apartment>("/api/apartments/" + id, {
        key: "getApartmentById",
        server: true,
      });

      if (!apartment.value) {
        throw new Error("الايجار المطلوب غير موجود.");
      }

      const newApartment = {
        apartmentNumber: apartment.value.apartmentNumber,
        ownerName: apartment.value.ownerName,
        ownerNumber: apartment.value.ownerNumber,
        agentName: apartment.value.agentName,
        agentNumber: apartment.value.agentNumber,
        realLocation: apartment.value.realLocation,
        electricSub: apartment.value.electricSub,
        waterSub: apartment.value.waterSub,
        renterName: payload.renterName,
        renterNumber: payload.renterNumber,
        rentDuration: apartment.value.rentDuration,
        rentAmount: apartment.value.rentAmount,
        rentDate: apartment.value.rentDate,
        rentPaymentWay: apartment.value.rentPaymentWay,
        isFurniture: apartment.value.isFurniture,
        rentStatus: 3,
        renterNationality: apartment.value.renterNationality,
        renterIdentification: apartment.value.renterIdentification,
        isServiceIncluded: apartment.value.isServiceIncluded,
        insurance: apartment.value.insurance,
        commissionAmount: apartment.value.insurance,
        //@ts-expect-error
        buildingId: apartment.value.Building.id,
      };
      const result = await $fetch("/api/apartments", { method: "POST", body: newApartment });
      // update the apartment
      await $fetch("/api/apartments/" + id, {
        method: "PUT",
        body: { rentStatus: 1 },
      });
      // Upload the furniture images with the new apartment's ID as the related ID
      if (contractImages.length > 0) {
        const res: boolean = await uploadFile(contractImages, "apartments", result.data.id, "contract");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + id, { method: "PUT", body: { rentStatus: 3 } });
          await $fetch("/api/apartments/" + result.data.id, { method: "DELETE" });
          throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
        }
      }

      await refreshNuxtData("getApartments");
      useState("isBrokenModalOpen").value = false;
      handleSuccess("تم تعديل الايجار بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء التعديل");
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const renewApartment = async (id: number, contractImages: any) => {
    try {
      // update the apartment
      await $fetch("/api/apartments/" + id, { method: "PUT", body: { rentStatus: 2 } });

      // Upload the furniture images with the new apartment's ID as the related ID
      if (contractImages.length > 0) {
        const res: boolean = await uploadFile(contractImages, "apartments", id, "new-contract");
        if (!res) {
          // Optionally, you can delete the created apartment if file upload fails
          await $fetch("/api/apartments/" + id, { method: "PUT", body: { rentStatus: 3 } });
          throw new Error("فشل رفع الملفات");
        }
      }

      await refreshNuxtData("getApartments");
      useState("isRenewedModalOpen").value = false;
      handleSuccess("تم تعديل الايجار بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء التعديل");
    } finally {
      useLoadingIndicator().finish();
    }
  };

  return { createApartment, editApartment, expireApartment, brokeApartment, renewApartment, deleteApartment, getOneApartment, getDropdownItems };
}
