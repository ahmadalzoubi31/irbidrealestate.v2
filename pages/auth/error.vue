<script setup lang="ts">
// Remember to disable the middleware protection from your page!
definePageMeta({
  middleware: "sidebase-auth",
  layout: "auth",
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
});

const route = useRoute();
const errorCode = computed(() => route.query.error);
console.log(errorCode.value);
</script>

<template></template>
