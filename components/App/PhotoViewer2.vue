<template>
  <h2>Photo Viewer</h2>
  <img v-if="photoUrl" :src="photoUrl" alt="Uploaded photo" />
</template>

<script setup lang="ts">
const props = defineProps({
  photoKey: {
    type: String,
    required: true,
  },
});

const photoUrl = computed(() => (props.photoKey ? `/api/v2/files/${props.photoKey}` : null));
</script>
