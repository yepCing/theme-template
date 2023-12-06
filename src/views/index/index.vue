<template>
  <div class="index-container">
    <div
      class="bg"
      :style="`background-image:url(${store.state.configObj.background})`"
    ></div>
    <div class="mask"></div>
    <div class="index-desc">
      <div class="proj-desc px-15">
        <h3 class="proj-title">{{ store.state.topic }}</h3>
        <div class="proj-bio">
          {{ store.state.configObj.bio }}
        </div>
        <div class="proj-more fw-b mt-5 cursor-p" @click="router.push('/home')">
          <span class="mr-2">More</span>
          <img
            src="@/assets/img/icon/arrow-right.svg"
            style="vertical-align: middle"
            width="20"
            alt=""
          />
        </div>
      </div>
      <swiper
        class="swiper-container"
        v-if="list.length"
        :modules="modules"
        :slides-per-view="3"
        centerInsufficientSlides
        :loop="list.length >= 6"
        :space-between="20"
        @swiper="onSwiper"
        :autoplay="{
          delay: 2000,
          disableOnInteraction: false,
        }"
        :pagination="{ type: 'progressbar' }"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="(item, index) in list" :key="index">
          <img class="swiper-img" :src="item" alt="" />
        </swiper-slide>
      </swiper>
      <h3 class="cur-index">
        {{ activeIndex }}
      </h3>
    </div>
    <share-bar class="share-bar"></share-bar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import ShareBar from "@/components/share-bar/share-bar.vue";
const modules = [Autoplay, Pagination];
const router = useRouter();
const store = useStore();

const list = computed(() => {
  return store.state.configObj.imgCIDTable.map((item: { CID: string }) => {
    return store.state.gateway + item.CID;
  });
});
let activeIndex = list.value.length ? ref("01") : ref("");

const onSwiper = () => {
  // console.log(1)
};
const onSlideChange = (swiper: typeof Swiper) => {
  activeIndex.value = "0" + (swiper.realIndex + 1);
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 2000px) {
  .index-desc {
    min-height: 700px !important;
  }
  .swiper-img {
    height: 700px !important;
  }
}
@media screen and (min-width: 1600px) and (max-width: 2000px) {
  .index-desc {
    min-height: 500px !important;
  }
  .swiper-img {
    height: 500px !important;
  }
}
@media screen and (max-width: 768px) {
  .index-container {
    height: auto !important;
    overflow: auto !important;
    .index-desc {
      position: static !important;
      z-index: 2;
      flex-direction: column;
      // bottom: 100px !important;
      .cur-index {
        bottom: -40px !important;
      }
      .proj-title {
        position: static !important;
        margin-bottom: 10px !important;
      }
      .proj-desc {
        position: relative !important;
        z-index: 2;
        width: 100% !important;
        padding: 0 12px !important;
        box-sizing: border-box;
      }
      .proj-title {
        font-size: 40px !important;
        top: -60px !important;
      }
    }
    .swiper-container {
      padding: 0 10px;
      box-sizing: border-box;
      width: 100% !important;
      margin-top: 60px;
      .swiper-img {
        width: 100%;
        height: 200px !important;
        object-fit: cover;
        margin-bottom: 20px !important;
      }
    }
    .share-bar {
      margin: 30px 12px !important;
      position: relative !important;
      bottom: 0 !important;
      left: 0 !important;
    }
  }
}
:deep .swiper-pagination-progressbar-fill {
  background: #fff !important;
}
:deep .swiper-pagination-progressbar {
  bottom: 0 !important;
  top: initial !important;
  width: 70% !important;
}
:deep .swiper-scrollbar-drag {
  background: #fff !important;
}
.index-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .mask {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(14, 14, 44, 0.5);
  }
  .index-desc {
    display: flex;
    z-index: 2;
    position: absolute;
    width: 100%;
    min-height: 200px;
    left: 0;
    bottom: 100px;
    .proj-desc {
      position: relative;
      width: 50%;
      color: #fff;
      .proj-title {
        position: absolute;
        top: -120px;
        font-size: 80px;
        margin: 0;
      }
      .proj-bio {
        max-height: 200px;
        overflow: auto;
      }
      .proj-more {
        display: inline-block;
        padding: 16px 80px;
        font-size: 24px;
        background: rgba(14, 14, 44, 0.5);
        border: 1px solid #ffffff;
        border-radius: 8px;
      }
    }
    .swiper-container {
      width: 50%;
      .swiper-img {
        width: 100%;
        height: 320px;
        object-fit: cover;
        border-radius: 16px;
        margin-bottom: 50px;
      }
    }
    .cur-index {
      position: absolute;
      margin: 0;
      right: 30px;
      bottom: -25px;
      color: #fff;
      font-size: 40px;
    }
  }
  .share-bar {
    z-index: 2;
    position: absolute;
    left: 64px;
    bottom: 40px;
  }
}
</style>
