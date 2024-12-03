import type { Apartment } from "@prisma/client";

// composables/useApartments.ts
export function useApartments() {
    const nuxtApp = useNuxtApp();

    const {
        data: apartments,
        status,
        refresh: refreshApartments,
    } = useFetch<Apartment[]>("/api/apartments", {
        key: "getApartments",
        server: false,
        lazy: true,
        getCachedData(key) {
            return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        },
    });

    return { apartments, status, refreshApartments };
}
