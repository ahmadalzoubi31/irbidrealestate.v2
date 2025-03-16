import type { Apartment, ApartmentRenterInfo, Building } from "@prisma/client";

interface ApartmentWithBuilding extends Apartment {
  building: Building;
  renterInfo: ApartmentRenterInfo[];
}
// composables/useApartmentActions.ts
export function useApartmentActions() {
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

  const getOneApartment = async (id: number) => {
    const { data, status, error } = await useFetch<ApartmentWithBuilding>("/api/apartments/" + id, {
      key: "getApartmentById",
      server: true,
    });

    if (status.value === "error") {
      handleError(error.value, "الايجار المطلوب غير موجود.");
      navigateTo("/apartments/rents");
    }

    return { data: data.value, status: status.value };
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

  const updateImages = async (images: Image[], oldKeys: string[], type: string) => {
    if (images.length > 0) {
      if (oldKeys.length > 0) {
        await $fetch("/api/v2/files", {
          method: "DELETE",
          body: { keys: oldKeys },
        });
      }
      const keys: string[] = await uploadFile(images, type);
      if (!keys) {
        throw new Error(`فشل رفع الملفات - ${type}`);
      }
      return keys.join(",");
    }
    return oldKeys.join(",");
  };

  const createApartment = async (payload: ICreateApartment, furnitureImages: Image[]) => {
    let contractImageKey: string = "";
    let renterIdentificationImageKey: string = "";

    const { renterInfo, ...apartmentData } = payload;

    const recordWithImageNeedUpload = renterInfo.filter(
      (record) =>
        (typeof record.identificationImage === "object" && record.identificationImage !== null && "content" in record.identificationImage) ||
        (typeof record.contractImage === "object" && record.contractImage !== null && "content" in record.contractImage)
    );
    const recordWithOutImage = renterInfo.filter(
      (record) =>
        (typeof record.identificationImage === "string" || record.identificationImage === null || record.identificationImage === undefined) &&
        (typeof record.contractImage === "string" || record.contractImage === null || record.contractImage === undefined)
    );

    const renterIdentificationImage = recordWithImageNeedUpload
      .filter((el) => el.identificationImage !== null)
      .map((detail) => detail.identificationImage) as Image[];

    const contractImage = recordWithImageNeedUpload.filter((el) => el.contractImage !== null).map((detail) => detail.contractImage) as Image[];

    const recordWithImageNeedUploadRest = recordWithImageNeedUpload.map(({ contractImage, identificationImage, ...rest }) => rest);

    try {
      if (renterIdentificationImage && renterIdentificationImage.length !== 0) {
        renterIdentificationImageKey += await uploadFile(renterIdentificationImage, "renterIdentification");
      }
      if (contractImage && contractImage.length !== 0) {
        contractImageKey += await uploadFile(contractImage, "contract");
      }

      const newRecordWithImageNeedUpload: IApartmentRenterInfo[] = recordWithImageNeedUploadRest.map((detail) => ({
        ...detail,
        identificationImage: renterIdentificationImageKey,
        contractImage: contractImageKey,
      }));

      const finalRenterDetails = [...recordWithOutImage, ...newRecordWithImageNeedUpload];

      try {
        // Create the Apartment
        await $fetch("/api/apartments", {
          method: "POST",
          body: {
            ...apartmentData,
            renterInfo: finalRenterDetails,
          },
        });
        await refreshNuxtData("getApartments");
        await navigateTo("/apartments/rents");
        handleSuccess("تم انشاء الايجار بنجاح");
      } catch (error) {
        handleError(error, "حدث خطأ أثناء الحفظ");
      }
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء رفع الملفات");
    } finally {
      useLoadingIndicator().finish();
    }
  };

  const editApartment = async (id: number, payload: IEditApartment) => {
    debugger;
    let contractImageKey: string = "";
    let renterIdentificationImageKey: string = "";

    const { renterInfo, ...apartmentData } = payload;

    const recordWithImageNeedUpload = renterInfo.filter(
      (record) =>
        (typeof record.identificationImage === "object" && record.identificationImage !== null && "content" in record.identificationImage) ||
        (typeof record.contractImage === "object" && record.contractImage !== null && "content" in record.contractImage)
    );
    const recordWithOutImage = renterInfo.filter(
      (record) =>
        (typeof record.identificationImage === "string" || record.identificationImage === null || record.identificationImage === undefined) &&
        (typeof record.contractImage === "string" || record.contractImage === null || record.contractImage === undefined)
    );

    const renterIdentificationImage = recordWithImageNeedUpload
      .filter((el) => el.identificationImage !== null)
      .map((detail) => detail.identificationImage) as Image[];

    const contractImage = recordWithImageNeedUpload.filter((el) => el.contractImage !== null).map((detail) => detail.contractImage) as Image[];

    const recordWithImageNeedUploadRest = recordWithImageNeedUpload.map(({ contractImage, identificationImage, ...rest }) => rest);

    try {
      if (renterIdentificationImage && renterIdentificationImage.length !== 0) {
        renterIdentificationImageKey += await uploadFile(renterIdentificationImage, "renterIdentification");
      }
      if (contractImage && contractImage.length !== 0) {
        contractImageKey += await uploadFile(contractImage, "contract");
      }

      const updatedRecordWithImageNeedUpload: IApartmentRenterInfo[] = recordWithImageNeedUploadRest.map((detail) => ({
        ...detail,
        identificationImage: renterIdentificationImageKey,
        contractImage: contractImageKey,
      }));

      const finalRenterDetails = [...recordWithOutImage, ...updatedRecordWithImageNeedUpload];

      try {
        await $fetch("/api/apartments/" + id, { method: "PUT", body: { ...apartmentData, renterInfo: finalRenterDetails } });
        await refreshNuxtData("getApartments");
        await navigateTo("/apartments/rents");
        handleSuccess("تم تعديل الايجار بنجاح");
      } catch (error) {
        handleError(error, "حدث خطأ أثناء التعديل");
      }
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء رفع الملفات");
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
  ];

  const expireApartment = async (id: number, clearanceImages: any) => {
    try {
      await $fetch("/api/apartments/" + id, { method: "PUT", body: { rentStatus: 0 } });
      await uploadImages(clearanceImages, "clearance");
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
      const { data: apartment } = await useFetch<ApartmentWithBuilding>("/api/apartments/" + id, {
        key: "getApartmentById",
        server: true,
      });

      if (!apartment.value) {
        throw new Error("الايجار المطلوب غير موجود.");
      }

      const newApartment = {
        ...apartment.value,
        renterName: payload.renterName,
        renterNumber: payload.renterNumber,
        rentStatus: 3,
        buildingId: apartment.value.building.id,
      };

      const result = await $fetch("/api/apartments", { method: "POST", body: newApartment });
      await $fetch("/api/apartments/" + id, { method: "PUT", body: { rentStatus: 1 } });
      await uploadImages(contractImages, "new-contract");

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
      await $fetch("/api/apartments/" + id, { method: "PUT", body: { rentStatus: 2 } });
      await uploadImages(contractImages, "renewed-contract");
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
