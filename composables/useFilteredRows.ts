export function useFilteredRows<T>(
  data: Ref<T[] | null>, // Allow null as part of the type
  query: Ref<string>,
  excludedKeys: string[] = []
) {
  return computed(() => {
    if (!data.value) return []; // Handle null or undefined
    if (!query.value) return data.value;
    return data.value.filter((item: any) =>
      Object.entries(item).some(
        ([key, value]) =>
          !excludedKeys.includes(key) &&
          String(value).toLowerCase().includes(query.value.toLowerCase())
      )
    );
  });
}
