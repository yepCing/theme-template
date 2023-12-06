<template>
  <div class="d-flex flex-wrap list-skeleton-container">
    <div class="item" v-for="i in 50" :key="i">
      <el-skeleton :style="{ width: cardWidth + 'px' }" animated>
        <template #template>
          <el-skeleton-item
            variant="image"
            style="height: 350px"
            :style="{ width: cardWidth + 'px' }"
          />
          <div style="padding: 14px">
            <el-skeleton-item variant="p" style="width: 50%" />
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
              "
            >
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
let rowCount = ref(0);
let cardWidth = ref(240);
const getSize = () => {
  let width = document.body.offsetWidth;
  if (width > 800 && width < 1200) {
    rowCount.value = 4;
    width -= 128;
  } else if (width > 500 && width < 800) {
    rowCount.value = 3;
    width -= 32;
  } else if (width < 500) {
    width -= 32;
    rowCount.value = 2;
  } else {
    rowCount.value = 6;
    width -= 128;
  }
  cardWidth.value = (width - (rowCount.value - 1) * 20) / rowCount.value;
};
window.addEventListener("resize", getSize);

onMounted(() => {
  getSize();
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .list-skeleton-container {
    padding: 0 16px !important;
  }
}
.list-skeleton-container {
  padding: 0 64px;
  justify-content: space-between;
}

// .item {
//   margin-left: 20px;
// }
:deep .el-skeleton__image {
  border-radius: 20px;
}
</style>
