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
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const route = useRoute();
const store = useStore();
store.dispatch("initProject", route.params.bucketName);
</script>

<style lang="scss" scoped></style>
