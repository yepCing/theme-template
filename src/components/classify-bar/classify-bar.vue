<template>
  <div class="classify-bars-container al-c space-btw">
    <select-cpm></select-cpm>

    <div>
      <div
        class="upload-btn ml-8 al-c cursor-p"
        @click="handleUpload(false)"
        v-if="showUpload"
      >
        <img src="@/assets/img/icon/upload1.svg" width="32" alt="" />
        <span class="ml-2 upload-text">UPLOAD</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectCpm from "@/components/select-cpm/select-cpm.vue";
import { useStore } from "@/store";
import emitBus from "@/utils/mitt";
import { computed } from "vue";

const store = useStore();

const showUpload = computed(() => {
  if (!store.state.address) return false;
  return (
    store.state.overview.owner.toLocaleLowerCase() ==
    store.state.address.toLocaleLowerCase()
  );
});
const handleUpload = async (isMobile = false) => {
  if (store.state.token) {
    emitBus.emit("handleUpload", isMobile);
  } else {
    emitBus.emit("onShowConnect");
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .classify-bars-container {
    padding: 24px 16px !important;
    display: none !important;
  }
  .upload-btn {
    display: none;
  }
}
:deep .el-input__wrapper {
  padding: 4px 15px !important;
  border-radius: 8px !important;
}
.classify-bars-container {
  padding: 24px 64px;
}
.upload-btn {
  padding: 8px 16px;
  color: #0f172a;
  font-weight: bold;
  background: #f9cc45;
  border-radius: 8px;
  letter-spacing: 0;
}
</style>
