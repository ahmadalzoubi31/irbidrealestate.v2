<script setup lang="ts">
const colorMode = useColorMode();

colorMode.preference = "light";

// navigateTo("/buildings");
const photoKey = ref("NDusXRL-IpnpUHRzy3SVP ");
</script>

<template>
  <div>
    <h1>Home</h1>
    <AppPhotoUploader />
    <AppPhotoViewer2 :photoKey="photoKey" />
  </div>
</template>
