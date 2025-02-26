<template>
  <input type="file" @change="uploadPhoto" accept="image/*" />
</template>

<script setup>
const uploadPhoto = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("photo", file);

  const { key } = await $fetch("/api/v2/files", {
    method: "POST",
    body: formData,
  });

  // Save the key to your database or state
  console.log("Upload successful:", key);
};
</script>
