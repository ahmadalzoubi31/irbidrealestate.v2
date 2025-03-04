import type { Building } from "@prisma/client";

// composables/useBuildings.ts
export function useBuildings() {
  useLoadingIndicator().start();
  const nuxtApp = useNuxtApp();
  const toast = useToast();

  const { data: buildings, status } = useFetch<Building[]>("/api/buildings", {
    key: "getBuildings",
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

  // Create or retrieve state for buildings
  const buildingList = useState<Building[]>("buildingList", () => []);

  // Use watchEffect to sync `buildingList` with `buildings`
  watchEffect(() => {
    if (buildings.value) {
      buildingList.value = buildings.value;
    }
  });

  return { buildings, status };
}
