<template>
  <div class="m-date mt-4">
    <div class="al-c space-btw">
      <div v-for="(item, index) in list" :key="index" class="al-c">
        <img :src="item.img" width="16" alt="" />
        <span class="ml-1">{{ item.value }}</span>
      </div>
    </div>
    <select-cpm v-show="showSelect"></select-cpm>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import SelectCpm from "@/components/select-cpm/select-cpm.vue";
const store = useStore();
const route = useRoute();
const userInfo = computed(() => {
  return store.state.userInfo || {};
});
const projectInfo = computed(() => {
  return store.state.projectInfo || {};
});
const list = computed(() => {
  return [
    {
      img: require("@/assets/img/icon/img.svg"),
      value: projectInfo.value.posts
        ? projectInfo.value.posts.toLocaleString()
        : "0",
    },
    {
      img: require("@/assets/img/icon/contributor.svg"),
      value: projectInfo.value.participators
        ? projectInfo.value.participators.toLocaleString()
        : "0",
    },
    {
      img: require("@/assets/img/icon/user-posts.svg"),
      value: userInfo.value.posts ? userInfo.value.posts.toLocaleString() : "0",
    },
    {
      img: require("@/assets/img/icon/ratio.svg"),
      value: userInfo.value.ratio ? userInfo.value.ratio + "%" : "0%",
    },
  ];
});

const showSelect = computed(() => {
  return !/\/detail\//.test(route.path);
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .m-date {
    display: flex !important;
  }
}
.m-date {
  display: none;
  flex-direction: column;
  font-family: "DIN Alternate";
}
</style>
