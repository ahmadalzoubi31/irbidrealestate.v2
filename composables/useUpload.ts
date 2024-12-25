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

  const uploadFile = async (files: any[], relatedType: string, relatedId: string) => {
    try {
      // Validate file types and sizes
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10 MB

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`نوع الملف غير صالح: ${file.type}`);
        }
        if (file.size > maxSize) {
          throw new Error(`حجم الملف يتجاوز الحد المسموح به ${maxSize / (1024 * 1024)} ميغابايت`);
        }
      }

      // Sanitize file names
      // const sanitizedFiles = files.map(file => {
      //     const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      //     return { ...file, name: sanitizedFileName };
      // });

      // Upload files
      // await $fetch(`/api/files?relatedType=${relatedType}&relatedId=${relatedId}`, {
      //     method: "POST",
      //     body: sanitizedFiles,
      //     key: "uploadFile",
      // });

      await $fetch(`/api/upload?relatedType=${relatedType}&relatedId=${relatedId}`, {
        method: "POST",
        body: files,
      });
      handleSuccess("تم رفع الملفات بنجاح");
    } catch (error: any) {
      handleError(error, "حدث خطأ أثناء رفع الملفات");
    }
  };


  return { uploadFile };
}
