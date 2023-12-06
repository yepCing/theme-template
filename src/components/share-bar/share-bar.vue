<template>
  <div class="al-c">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="icon-container cursor-p"
      @click="handleOpen(item.link)"
      v-show="item.link"
    >
      <img :src="item.img" alt="" width="22" style="vertical-align: bottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
const store = useStore();

const list = [
  {
    img: require("@/assets/img/icon/discord.svg"),
    link: store.state.configObj.discord,
  },
  {
    img: require("@/assets/img/icon/telegram.svg"),
    link: store.state.configObj.telegram,
  },
  {
    img: require("@/assets/img/icon/twttier.svg"),
    link: store.state.configObj.twttier,
  },
];
const handleOpen = (link: string) => {
  window.open(link);
};
</script>

<style lang="scss" scoped>
.icon-container {
  padding: 10px;
  border-radius: 50%;
  background: rgba(14, 14, 44, 0.5);
}
.icon-container + .icon-container {
  margin-left: 20px;
}
</style>
