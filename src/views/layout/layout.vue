<template>
  <div class="layout">
    <nav-header></nav-header>
    <upload-cpm></upload-cpm>
    <Suspense>
      <!-- <div class="content"> -->
      <router-view />
      <!-- </div> -->
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import NavHeader from "@/components/nav-header/nav-header.vue";
import UploadCpm from "@/components/upload-cpm/upload-cpm.vue";
</script>

<style lang="scss" scoped></style>
