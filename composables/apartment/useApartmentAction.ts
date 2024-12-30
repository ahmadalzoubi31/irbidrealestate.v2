import type { Apartment } from "@prisma/client";

// composables/useApartmentActions.ts
export function useApartmentActions() {
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

    const getOneApartment = async (id: string) => {
        const { data, status, error } = await useFetch<Apartment>("/api/apartments/" + id, {
            key: "getApartmentById",
            server: false,
            lazy: true
        });

        if (status.value === 'error') {
            handleError(error.value, "الايجار المطلوب غير موجود.");
            navigateTo("/apartments/rents");
        }

        return { data: data.value, status: status.value }

    }
    const createApartment = async (payload: ICreateApartment, furnitureImages: any[], renterIdentificationImage: any, contractImage: any) => {
        try {
            // Create the apartment
            const newApartment = await $fetch("/api/apartments", { method: "POST", body: payload });

            // Upload the furniture images with the new apartment's ID as the related ID
            if (furnitureImages.length > 0) {
                const res: boolean = await uploadFile(furnitureImages, "apartments", newApartment.data.id.toString(), "furniture");
                if (!res) {
                    // Optionally, you can delete the created apartment if file upload fails
                    await $fetch("/api/apartments/" + newApartment.data.id, { method: "DELETE" });
                    throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
                }
            }
            // Upload the renter identification image with the new apartment's ID as the related ID
            if (renterIdentificationImage.length > 0) {
                const res: boolean = await uploadFile(renterIdentificationImage, "apartments", newApartment.data.id.toString(), "renter-identification");
                if (!res) {
                    // Optionally, you can delete the created apartment if file upload fails
                    await $fetch("/api/apartments/" + newApartment.data.id, { method: "DELETE" });
                    throw new Error("تم إنشاء الايجار ولكن فشل رفع الملفات. تم حذف الايجار.");
                }
            }
            // Upload the contract image with the new apartment's ID as the related ID
            if (contractImage.length > 0) {
                const res: boolean = await uploadFile(contractImage, "apartments", newApartment.data.id.toString(), "contract");
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
            useLoadingIndicator().finish()
        }
    }
    const editApartment = async (id: string, payload: IEditApartment) => {
        try {
            // Separate the body form the files
            const { furnitureImages, renterIdentificationImage, contractImage, ...adData } = payload;
            // Separate new files from existing files
            const newFiles = furnitureImages.filter(file => !file.id);
            const existingFiles = furnitureImages.filter(file => file.id);

            // Update the apartment details
            await $fetch("/api/apartments/" + id, { method: "PUT", body: payload });

            // Handle furniture images
            if (newFiles.length > 0) {
                try {
                    await uploadFile(newFiles, "apartments", id, "furniture");
                } catch (uploadError: any) {
                    handleError(uploadError, "حدث خطأ أثناء رفع الملف");
                }
            }

            // Handle renter identification image
            if (renterIdentificationImage) {
                try {
                    await uploadFile(renterIdentificationImage, "apartments", id, "renter-identification");
                } catch (uploadError: any) {
                    handleError(uploadError, "حدث خطأ أثناء رفع الملف");
                }
            }

            // Handle contract image
            if (contractImage) {
                try {
                    await uploadFile(contractImage, "apartments", id, "contract");
                } catch (uploadError: any) {
                    handleError(uploadError, "حدث خطأ أثناء رفع الملف");
                }
            }

            // handle file deletions
            const filesToDelete = existingFiles.filter(file => !file.status);
            if (filesToDelete.length > 0) {
                await $fetch("/api/files/delete", {
                    method: "POST",
                    body: { files: filesToDelete.map(file => file.id) },
                });
            }


            await refreshNuxtData("getApartments");
            await navigateTo("/apartments/rents");
            handleSuccess("تم تعديل الايجار بنجاح");
        } catch (error: any) {
            handleError(error, "حدث خطأ أثناء التعديل");
        } finally {
            useLoadingIndicator().finish()
        }
    }
    const deleteApartment = async (id: string) => {
        const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
        if (!confirmDelete) return;

        try {
            await $fetch("/api/apartments/" + id, { method: "DELETE", key: "deleteApartment" });
            await refreshNuxtData("getApartments");
            handleSuccess("تم حذف الايجار بنجاح");
        } catch (error: any) {
            handleError(error, "حدث خطأ أثناء الحذف");
        } finally {
            useLoadingIndicator().finish()
        }
    };
    const getDropdownItems = (row: { id: string }, openModal: (type: string) => void) => [
        [
            {
                label: "تعديل",
                icon: "i-heroicons-pencil-square-20-solid",
                click: () => navigateTo(`/apartments/rents/${row.id}/edit`)
            },
        ],
        [
            { label: "فسخ", icon: "i-heroicons-document-duplicate-20-solid", click: () => openModal("broken") },
            { label: "انهاء", icon: "i-heroicons-archive-box-20-solid", click: () => openModal("expired") },
            { label: "تجديد", icon: "i-heroicons-arrow-right-circle-20-solid", click: () => openModal("renewed") },
        ],
        [
            {
                label: "مسح",
                icon: "i-heroicons-trash-20-solid",
                click: () => deleteApartment(row.id),
            },
        ],
    ];

    return { createApartment, editApartment, deleteApartment, getOneApartment, getDropdownItems };
}
