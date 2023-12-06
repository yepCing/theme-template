<template>
  <div class="classify-bars-container al-c space-btw">
    <div class="contributor al-c">
      <div class="al-c">
        <img src="@/assets/img/icon/img.svg" width="16" alt="" />
        <span class="data-value ml-3">{{
          projectInfo.posts.toLocaleString()
        }}</span>
      </div>
      <div class="al-c ml-6">
        <img src="@/assets/img/icon/contributor.svg" width="16" alt="" />
        <span class="data-value ml-3">{{
          projectInfo.participators.toLocaleString()
        }}</span>
      </div>
    </div>

    <select-cpm></select-cpm>
  </div>
</template>

<script setup lang="ts">
import SelectCpm from "@/components/select-cpm/select-cpm.vue";
import { computed } from "vue";
import { useStore } from "@/store";
const store = useStore();
const projectInfo = computed(() => {
  return store.state.projectInfo ?? { posts: 0, participators: 0 };
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .classify-bars-container {
    padding: 24px 16px !important;
    display: none !important;
  }
}
:deep .el-input__wrapper {
  padding: 4px 15px !important;
  border-radius: 8px !important;
}
.classify-bars-container {
  padding: 24px 64px;
}
.contributor {
  padding: 8px 16px;
  border: 1px solid rgba(140, 140, 161, 0.25);
  border-radius: 8px;
  .data-value {
    font-family: "DIN Alternate";
    color: #0e0e2c;
    font-size: 24px;
    line-height: 30px;
    font-weight: bold;
  }
}
</style>
