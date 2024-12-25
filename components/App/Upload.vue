<script setup lang="ts">
// const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });

// const validateFiles = () => {
//   for (const file of files.value) {
//     if (!file.type.startsWith("image/")) {
//       alert("Only image files are allowed.");
//       return false;
//     }
//   }
//   return true;
// };

// const handleSubmit = async (e: Event) => {
//   e.preventDefault();

//   if (!validateFiles()) {
//     return;
//   }

//   await $fetch("/api/upload", {
//     method: "POST",
//     body: files.value,
//   });
// };
</script>

<template>
  <div></div>
  <!-- <form @submit.prevent="handleSubmit">
    <UInput ref="fileInput" name="file" type="file" accept="image/*" @input="handleFileInput" multiple :size="'sm'" :required="false" />
    <UButton type="submit">Upload</UButton>
  </form> -->
</template>

<!-- <style scoped>
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.preview-item {
  position: relative;
}

.image-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> -->
