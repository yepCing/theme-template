<template>
  <div class="m-date al-c mt-4 space-btw">
    <select-cpm v-show="showSelect"></select-cpm>
    <div
      class="m-upload-btn ml-8 al-c cursor-p"
      @click="handleUpload(true)"
      v-if="showUpload"
    >
      <img src="@/assets/img/icon/upload1.svg" width="32" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import emitBus from "@/utils/mitt";
import SelectCpm from "@/components/select-cpm/select-cpm.vue";
const route = useRoute();
const store = useStore();
const showSelect = computed(() => {
  return !/\/detail\//.test(route.path);
});
const showUpload = computed(() => {
  if (!store.state.address) return false;
  return (
    store.state.overview.owner.toLocaleLowerCase() ==
    store.state.address.toLocaleLowerCase()
  );
});
const handleUpload = (isMobile = false) => {
  if (store.state.token) {
    emitBus.emit("handleUpload", isMobile);
  } else {
    emitBus.emit("onShowConnect");
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .m-date {
    display: flex !important;
  }
}
.m-date {
  display: none;
  font-family: "DIN Alternate";
}
.m-upload-btn {
  padding: 8px !important;
  margin-left: 0px !important;
  color: #fff;
  font-weight: bold;
  background: #f9cc45;
  border-radius: 8px;
  letter-spacing: 1px;
}
</style>
