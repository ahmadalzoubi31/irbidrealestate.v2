import type { Building } from "@prisma/client";

// composables/useBuildings.ts
export function useBuildings() {
    const nuxtApp = useNuxtApp();

    const {
        data: buildings,
        status,
        refresh: refreshBuildings,
    } = useFetch<Building[]>("/api/buildings", {
        key: "getBuildings",
        server: false,
        lazy: true,
        getCachedData(key) {
            return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        },
    });

    return { buildings, status, refreshBuildings };
}
