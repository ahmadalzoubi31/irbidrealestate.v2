<template>
  <div id="defaultLayout">
    <NuxtLoadingIndicator color="#aecc36" :height="2" errorColor="#da2c43" />
    <AppNavBar />
    <div class="px-4 sm:px-6 lg:px-8">
      <slot />
    </div>
  </div>
</template>
