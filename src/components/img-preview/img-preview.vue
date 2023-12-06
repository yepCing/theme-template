<template>
  <div class="preview">
    <div v-if="type == 'image'" class="img-preview">
      <el-image v-if="isDetailPage" :src="url" fit="contain" />
      <LazyImg v-else style="border-radius: 16px" :url="url" />
    </div>
    <div class="video-preview al-c f-center" v-else>
      <div class="video-icon pa-2 al-c">
        <img src="@/assets/img/icon/video.svg" width="16" alt="" />
        <span class="ml-1 fz-14" v-if="!seconds">Video</span>
        <span class="ml-1 fz-14" v-else>{{ minutes }}:{{ seconds }}</span>
      </div>
      <!-- <video
        class="video"
        ref="videoRef"
        :controls="controls"
        :src="url"
      ></video> -->

      <video
        class="video"
        :controls="controls"
        ref="videoRef"
        :style="detailPage ? 'height: 100%; border-radius:0' : ''"
      >
        <source :src="url + '#t=0.1'" />
      </video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LazyImg } from "vue-waterfall-plugin-next";
import { computed, ref, onMounted } from "vue";
import { useStore } from "@/store";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const props = defineProps({
  cid: String,
  type: {
    type: String,
    default: "image",
  },
  controls: {
    type: Boolean,
    default: false,
  },
  detailPage: {
    type: Boolean,
    default: false,
  },
});
const videoRef = ref<HTMLElement | null>(null);
let minutes = ref<number | string>("0");
let seconds = ref<number | string>("00");
const gateway = computed(() => {
  return store.state.gateway;
});
const url = computed(() => {
  if (props.cid) return gateway.value + props.cid;
  return "";
});
const isDetailPage = computed(() => {
  return /detail/.test(route.path);
});
onMounted(() => {
  if (props.type == "video") {
    videoRef.value?.addEventListener("loadedmetadata", (event: Event) => {
      let value = event.target as HTMLVideoElement;
      const duration = Math.ceil(value.duration);

      minutes.value = Math.floor(duration / 60);
      seconds.value =
        duration % 60 < 10 ? "0" + (duration % 60) : duration % 60;
    });
  }
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .preview {
    height: auto !important;
    flex: initial !important;
    border-right: none !important;
    // padding: 0 16px;
    box-sizing: border-box;
  }
}
.preview {
  width: 100%;
  height: 100%;
  flex: 1;
  border-right: 1px solid rgba(140, 140, 161, 0.25);
  .img-preview {
    width: 100%;
    height: 100%;
    :deep .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .video-preview {
    width: 100%;
    height: 100%;
    position: relative;
    .video-icon {
      position: absolute;
      left: 8px;
      top: 8px;
      border-radius: 39px;
      background: rgba(255, 255, 255, 0.5);
    }
    .video {
      width: 100%;
      height: 300px;
      border-radius: 16px;
      object-fit: contain;
      vertical-align: bottom;
    }
  }
}
</style>
