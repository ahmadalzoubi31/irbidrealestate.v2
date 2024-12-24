<script setup lang="ts">
// Create 10 slides
import type { AppFile } from "@prisma/client";

const containerRef = ref(null);
// const slides = ref(Array.from({ length: 10 }))

const swiper = useSwiper(containerRef);

defineProps({
  adId: {
    required: true,
  },
  files: {
    required: true,
    type: Array<AppFile>,
  },
});
</script>

<template>
  <div class="slider-container">
    <UButton class="nav-button prev-button" icon="i-heroicons-arrow-left-20-solid" @click="swiper.prev()" />
    <swiper-container ref="containerRef">
      <swiper-slide v-for="(slide, idx) in files" :key="idx">
        <NuxtImg :src="`/public/upload/files/ads/${adId}/${slide.name}`" :alt="slide.name" />
      </swiper-slide>
    </swiper-container>
    <UButton class="nav-button next-button" icon="i-heroicons-arrow-right-20-solid" @click="swiper.next()" />
  </div>
</template>

<style lang="css">
.slider-container {
  position: relative;
  display: flex;
  align-items: center;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  height: 40vh;
  font-size: 4rem;
  font-weight: bold;
  font-family: "Roboto", sans-serif;
}
</style>
