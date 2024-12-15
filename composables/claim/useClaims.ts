import type { Claim } from "@prisma/client";

// composables/useClaims.ts
export function useClaims() {
    useLoadingIndicator().start();
    const nuxtApp = useNuxtApp();
    const toast = useToast();

    const { data: claims, status } = useFetch<Claim[]>("/api/claims", {
        key: "getClaims",
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

    // Create or retrieve state for claims
    const claimList = useState<Claim[]>("claimList", () => []);

    // Use watchEffect to sync `claimList` with `claims`
    watchEffect(() => {
        if (claims.value) {
            claimList.value = claims.value;
        }
    });

    return { claims, status };

}
