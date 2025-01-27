<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
import { Analytics } from "@vercel/analytics/nuxt";
</script>
<template>
  <div id="defaultLayout">
    <NuxtLoadingIndicator color="#aecc36" :height="2" errorColor="#da2c43" />
    <AppNavBar />
    <div class="px-4 sm:px-6 lg:px-8">
      <slot />
    </div>
    <!-- <SpeedInsights />
    <Analytics /> -->
  </div>
</template>
