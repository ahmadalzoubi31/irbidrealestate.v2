import type { Apartment, ApartmentRenterInfo, Building } from "@prisma/client";

// Interface 
interface ApartmentWithBuilding extends Apartment {
  building: Building;
  renterInfo: ApartmentRenterInfo[];
}

// composables/useApartments.ts
export function useApartments() {
  useLoadingIndicator().start();
  const nuxtApp = useNuxtApp();
  const toast = useToast();

  const { data: apartments, status } = useFetch<ApartmentWithBuilding[]>("/api/apartments", {
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
  const apartmentList = useState<ApartmentWithBuilding[]>("apartmentList", () => []);

  // Use watchEffect to sync `apartmentList` with `apartments`
  watchEffect(() => {
    if (apartments.value) {
      apartmentList.value = apartments.value;
    }
  });

  return { apartments, status };
}
