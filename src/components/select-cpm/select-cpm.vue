<template>
  <div style="width: 200px">
    <el-select v-model="value" size="large" @change="onChange">
      <template #prefix>
        <img src="@/assets/img/icon/select-icon.svg" width="16" alt="" />
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import emitBus from "@/utils/mitt";
const value = ref("DEFAULT");
const options = [
  {
    label: "Featured",
    value: "DEFAULT",
  },
  {
    label: "Trending",
    value: "HOT",
  },
  {
    label: "Latest",
    value: "NEW",
  },
];

const onChange = (sortType: string) => {
  emitBus.emit("change", sortType);
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  :deep .el-select {
    margin: 10px 0 0 0 !important;
  }
  :deep .el-select.gateway-select {
    margin-right: 20px !important;
  }
}
:deep .el-select.gateway-select {
  margin-right: 20px;
}
:deep .el-select {
  margin-top: 0;
}
</style>
