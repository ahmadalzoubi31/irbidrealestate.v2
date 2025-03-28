import type { payment } from "@prisma/client";

// composables/usePayments.ts
export function usePayments() {
  useLoadingIndicator().start();
  const nuxtApp = useNuxtApp();
  const toast = useToast();

  const { data: payments, status } = useFetch<payment[]>(
    "/api/apartments/payments",
    {
      key: "getPayments",
      server: false,
      lazy: true,
      getCachedData: (key) =>
        nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    }
  );

  if (status.value === "error") {
    toast.add({
      description: "حدث خطأ اثناء جلب البيانات",
      color: "rose",
      timeout: 15000,
    });
  }

  // Create or retrieve state for payments
  const paymentList = useState<payment[]>("paymentList", () => []);

  // Use watchEffect to sync `paymentList` with `payments`
  watchEffect(() => {
    if (payments.value) {
      paymentList.value = payments.value;
    }
  });

  return { payments, status };
}
