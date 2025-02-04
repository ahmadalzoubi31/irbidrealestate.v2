import type { User } from "@prisma/client";

// composables/useUserActions.ts
export function useUserActions() {
  const toast = useToast();

  const getOneUser = async (id: number) => {
    const { data, status, error } = await useFetch<User>("/api/users/" + id, {
      key: "getUserById",
      server: false,
      lazy: true,
    });

    if (status.value === "error") {
      toast.add({
        description: error.value!.message || "المستخدم المطلوب غير موجود.",
        color: "rose",
        timeout: 10000,
      });
      navigateTo("/users");
    }

    return { data: data.value, status: status.value };
  };
  const createUser = async (payload: ICreateUser) => {
    try {
      await $fetch("/api/users", { method: "POST", body: payload });
      await refreshNuxtData("getUsers");
      await navigateTo("/users");

      toast.add({
        description: "تم انشاء المستخدم بنجاح",
        color: "primary",
        timeout: 5000,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء الحفظ",
        color: "rose",
        timeout: 10000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const editUser = async (id: number, payload: IEditUser) => {
    try {
      await $fetch("/api/users/" + id, { method: "PUT", body: payload });
      await refreshNuxtData("getUsers");
      await navigateTo("/users");

      toast.add({
        description: "تم تعديل المستخدم بنجاح",
        color: "primary",
        timeout: 5000,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء التعديل",
        color: "rose",
        timeout: 10000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };
  const deleteUser = async (id: number) => {
    const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
    if (!confirmDelete) return;

    try {
      await $fetch("/api/users/" + id, { method: "DELETE", key: "deleteUser" });
      await refreshNuxtData("getUsers");
      toast.add({
        description: "تم حذف المستخدم بنجاح",
        color: "primary",
        timeout: 5000,
      });
    } catch (error: any) {
      toast.add({
        description: error.message || "حدث خطأ أثناء الحذف",
        color: "rose",
        timeout: 10000,
      });
    } finally {
      useLoadingIndicator().finish();
    }
  };

  return { createUser, editUser, deleteUser, getOneUser };
}
