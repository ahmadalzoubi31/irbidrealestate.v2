import type { User } from "@prisma/client";

// composables/useUsers.ts
export function useUsers() {
  useLoadingIndicator().start();
  const nuxtApp = useNuxtApp();
  const toast = useToast();

  const { data: users, status } = useFetch<User[]>("/api/users", {
    key: "getUsers",
    server: false,
    lazy: true,
    getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  });

  if (status.value === "error") {
    toast.add({
      description: "حدث خطأ اثناء جلب البنايات",
      color: "rose",
      timeout: 10000,
    });
  }

  // Create or retrieve state for users
  const userList = useState<User[]>("userList", () => []);

  // Use watchEffect to sync `userList` with `users`
  watchEffect(() => {
    if (users.value) {
      userList.value = users.value;
    }
  });

  return { users, status };

}