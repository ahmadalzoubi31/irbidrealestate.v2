export const useUpload = () => {
  const toast = useToast();

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

  const uploadFile = async (files: Image[], tag: string) => {
    try {
      debugger;
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
      const result = await $fetch(`/api/v2/files`, {
        method: "POST",
        body: { files, tag },
      });

      if (!result) {
        throw new Error();
      }

      handleSuccess("تم رفع الملفات بنجاح");

      return result.keys;
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء رفع الملفات");
      return null;
    }
  };

  return { uploadFile };
};
