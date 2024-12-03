<script setup lang="ts">
// Reactive Navigators State
const navigators = reactive([
  { id: 0, name: "العقارات", href: "/apartments/rents", current: true },
  { id: 1, name: "الدفعات", href: "/apartments/payments", current: false },
]);

// Watch Route Changes to Update `current` State
const route = useRoute();
watchEffect(() => {
  navigators.forEach((el) => {
    el.current = el.href === route.fullPath;
  });
});

// Handle Click Event to Manually Update `current`
const handleClick = (id: number) => {
  navigators.forEach((el) => {
    el.current = el.id === id;
  });
};
</script>

<template>
  <nav class="bg-gray-100 shadow z-10 -mx-[30px]">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-center sm:justify-between h-16">
        <div class="flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="block">
            <div class="flex space-x-4">
              <NuxtLink
                v-for="item in navigators"
                :key="item.id"
                :to="item.href"
                :class="[
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white',
                  'px-3 py-2 rounded-md text-base font-normal',
                ]"
                @click="handleClick(item.id)"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pl-2 sm:static sm:inset-auto sm:mr-6 sm:pl-0"></div>
      </div>
    </div>
  </nav>
</template>

<style>
.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1 !important;
}
</style>
