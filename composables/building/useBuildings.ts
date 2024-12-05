import type { Building } from "@prisma/client";

// composables/useBuildings.ts
export function useBuildings() {
    const nuxtApp = useNuxtApp();

    const { data: buildings, status, refresh: refreshBuildings } = useFetch<Building[]>("/api/buildings", {
        key: "getBuildings",
        server: false,
        lazy: true,
        getCachedData: (key) => {
            const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            if (!data) {
                return;
            }


            return data
        }
    });

    return { buildings, status, refreshBuildings };
}
