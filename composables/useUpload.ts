export const useUpload = () => {
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

  const uploadFile = async (files: any[], relatedType: string, relatedId: number, purpose: string) => {
    try {
      // Validate file types and sizes
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 10 * 1024 * 1024; // 10 MB

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`نوع الملف غير صالح: ${file.type}`);
        }
        if (file.size > maxSize) {
          throw new Error(`حجم الملف يتجاوز الحد المسموح به ${maxSize / (1024 * 1024)} ميغابايت`);
        }
      }

      const res = await $fetch(`/api/upload?relatedType=${relatedType}&relatedId=${relatedId}&purpose=${purpose}`, {
        method: "POST",
        body: files,
      });

      // console.log({res})

      if (!res) {
        if (purpose === "furniture") {
          throw new Error("حدث خطأ أثناء رفع صور الأثاث");
        } else if (purpose === "renter-identification") {
          throw new Error("حدث خطأ أثناء رفع صورة هوية المستأجر");
        } else if (purpose === "contract") {
          throw new Error("حدث خطأ أثناء رفع صورة العقد");
        } else {
          throw new Error();
        }
      }

      if (purpose === "furniture") {
        handleSuccess("تم رفع صور الأثاث بنجاح");
      } else if (purpose === "renter-identification") {
        handleSuccess("تم رفع صورة هوية المستأجر بنجاح");
      } else if (purpose === "contract") {
        handleSuccess("تم رفع صورة العقد بنجاح");
      } else {
        handleSuccess("تم رفع الملفات بنجاح");
      }
      return true;
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء رفع الملفات");
      return false;
    }
  };

  return { uploadFile };
};
