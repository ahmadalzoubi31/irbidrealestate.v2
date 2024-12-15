<template>
  <div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

colorMode.preference = "light";

navigateTo("/buildings");
</script>
