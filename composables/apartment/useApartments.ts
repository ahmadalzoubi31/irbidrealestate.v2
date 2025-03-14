import type { Apartment } from "@prisma/client";

// composables/useApartments.ts
export function useApartments() {
  useLoadingIndicator().start();
  const nuxtApp = useNuxtApp();
  const toast = useToast();

  const { data: apartments, status } = useFetch<Apartment[]>("/api/apartments", {
    key: "getApartments",
    server: false,
    lazy: true,
    getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  });

  if (status.value === "error") {
    toast.add({
      description: "حدث خطأ اثناء جلب البنايات",
      color: "rose",
      timeout: 15000,
    });
  }

  // Create or retrieve state for apartments
  const apartmentList = useState<Apartment[]>("apartmentList", () => []);

  // Use watchEffect to sync `apartmentList` with `apartments`
  watchEffect(() => {
    if (apartments.value) {
      apartmentList.value = apartments.value;
    }
  });

  return { apartments, status };
}
