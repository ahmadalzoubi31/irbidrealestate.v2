import type { Building } from "@prisma/client";

// composables/useBuildings.ts
export function useBuildings() {
    const nuxtApp = useNuxtApp();
    const router = useRouter();

    const { data: buildings, status, execute } = useFetch<Building[]>("/api/buildings", {
        key: "getBuildings",
        server: false,
        lazy: true,
        getCachedData(key) {
            const redirectedFrom = useState("redirectedFrom", () => "");
            router.afterEach((to, from) => {
                redirectedFrom.value = from.name as string;
            });

            if (redirectedFrom.value === "apartments-rents") {
                return;
            }

            const data = nuxtApp.payload?.data?.[key] || nuxtApp.static?.data?.[key];
            if (!data) {
                return;
            }

            // Fetch cached data from Nuxt's payload or static data
            return data;
        },
    });

    return { buildings, status };
}
