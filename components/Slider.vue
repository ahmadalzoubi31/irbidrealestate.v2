<script setup lang="ts">
// Create 10 slides
import type {AdFile} from "@prisma/client";

const containerRef = ref(null)
// const slides = ref(Array.from({ length: 10 }))

const swiper = useSwiper(containerRef)

defineProps({
  adId: {
    required: true,
  },
  files: {
    required: true,
    type: Array<AdFile>,
  }
})
</script>

<template>
  <ClientOnly>
    <swiper-container ref="containerRef">
      <swiper-slide
          v-for="(slide, idx) in files"
          :key="idx"
      >
        <UButton icon="i-heroicons-arrow-right-20-solid" @click="swiper.prev()" />
        <NuxtImg :src="`/upload/files/ads/7/${slide.name}`" :alt="slide.name" />
        <!-- Go back one slide -->
        <!-- Go forward one slide -->
        <UButton icon="i-heroicons-arrow-left-20-solid" @click="swiper.next()" />
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<style lang="css">
swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  height: 40vh;
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
}
</style>
