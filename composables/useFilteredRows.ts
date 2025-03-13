import { isRef } from "vue";

export function useFilteredRows<T>(
  data: Ref<T[] | null> | T[], // Allow null as part of the type
  query: Ref<string>,
  excludedKeys: string[] = []
) {
  return computed(() => {
    const rows = isRef(data) ? data.value : data;
    if (!rows) return []; // Handle null or undefined
    if (!query.value) return rows;

    return rows.filter((item: any) =>
      Object.entries(item).some(([key, value]) => !excludedKeys.includes(key) && String(value).toLowerCase().includes(query.value.toLowerCase()))
    );
  });
}
