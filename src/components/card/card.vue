<template>
  <div class="card-info cursor-p">
    <div class="mask"></div>
    <!-- <LazyImg style="border-radius: 16px" :url="url" /> -->

    <img-preview :cid="item.cid" :type="item.type"></img-preview>

    <card-control class="control" :info="item"></card-control>
  </div>
</template>

<script setup lang="ts">
// import { LazyImg } from "vue-waterfall-plugin-next";
import ImgPreview from "@/components/img-preview/img-preview.vue";
import CardControl from "@/components/card-control/card-control.vue";
import { IItemInfo } from "@/request/type";
defineProps<{ item: IItemInfo }>();
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .control {
    display: none !important;
  }
}
.card-info {
  position: relative;
  overflow: hidden;
  .control {
    opacity: 0;
    transition: all 0.5s ease;
    border-radius: 16px;
  }
}
// .card-info:hover .mask {
//   background: rgba(14, 14, 44, 0.5);
// }
.mask {
  z-index: 998;
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  background: rgba(14, 14, 44, 0.05);
  border-radius: 16px;
}
.card-info:hover .control {
  opacity: 1;
  background: rgba(14, 14, 44, 0.5);
}
</style>
