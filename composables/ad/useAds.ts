import type { ad } from "@prisma/client";

// composables/useAds.ts
export function useAds() {
  useLoadingIndicator().start();
  const nuxtApp = useNuxtApp();
  const toast = useToast();

  const { data: ads, status } = useFetch<ad[]>("/api/ads", {
    key: "getAds",
    server: false,
    lazy: true,
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  });

  if (status.value === "error") {
    toast.add({
      description: "حدث خطأ اثناء جلب البنايات",
      color: "rose",
      timeout: 15000,
    });
  }

  // Create or retrieve state for ads
  const adList = useState<ad[]>("adList", () => []);

  // Use watchEffect to sync `adList` with `ads`
  watchEffect(() => {
    if (ads.value) {
      adList.value = ads.value;
    }
  });

  return { ads, status };
}
