import type { order } from "@prisma/client";

// composables/useOrders.ts
export function useOrders() {
  useLoadingIndicator().start();
  const nuxtApp = useNuxtApp();
  const toast = useToast();

  const { data: orders, status } = useFetch<order[]>("/api/orders", {
    key: "getOrders",
    server: false,
    lazy: true,
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  });

  if (status.value === "error") {
    toast.add({
      description: "حدث خطأ اثناء جلب البايانات",
      color: "rose",
      timeout: 15000,
    });
  }

  // Create or retrieve state for orders
  const orderList = useState<order[]>("orderList", () => []);

  // Use watchEffect to sync `orderList` with `orders`
  watchEffect(() => {
    if (orders.value) {
      orderList.value = orders.value;
    }
  });

  return { orders, status };
}
