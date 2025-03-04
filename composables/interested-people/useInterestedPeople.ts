import type { InterestedPeople } from "@prisma/client";

// composables/useInterestedPeoples.ts
export function useInterestedPeoples() {
  useLoadingIndicator().start();
  const nuxtApp = useNuxtApp();
  const toast = useToast();

  const { data: interestedPeoples, status } = useFetch<InterestedPeople[]>("/api/ads/interested-peoples", {
    key: "getInterestedPeoples",
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

  // Create or retrieve state for interestedPeoples
  const interestedPeopleList = useState<InterestedPeople[]>("interestedPeopleList", () => []);

  // Use watchEffect to sync `interestedPeopleList` with `interestedPeoples`
  watchEffect(() => {
    if (interestedPeoples.value) {
      interestedPeopleList.value = interestedPeoples.value;
    }
  });

  return { interestedPeoples, status };
}
