<template>
  <div class="home-container">
    <classify-bar></classify-bar>

    <list-skeleton v-if="listLoading && !list.length"></list-skeleton>
    <div class="water-fall">
      <Waterfall
        v-if="list.length"
        :list="list"
        :width="246"
        :gutter="20"
        :hasAroundGutter="false"
        :loadProps="{ error }"
        lazyload
        :breakpoints="{
          1200: {
            rowPerView: 4,
          },
          800: {
            rowPerView: 3,
          },
          500: {
            rowPerView: 2,
          },
        }"
      >
        <template #item="{ item }">
          <card :item="item" @click="handleDetail(item)"></card>
          <div class="al-c space-btw mt-2 contributor-info">
            <div class="al-c creator">
              <avatar :address="item.creator"></avatar>
              <span class="address ml-2">{{ item.creator.cutStr(6, 6) }}</span>
            </div>
            <div class="al-c">
              <img
                :src="
                  item.thumbed
                    ? require('@/assets/img/icon/like.svg')
                    : require('@/assets/img/icon/unlike.svg')
                "
                width="20"
                alt=""
                class="cursor-p"
                @click.stop="onLike(item)"
              />
              <span class="ml-2">{{ getLikeNum(item.thumbs) }} </span>
            </div>
          </div>
        </template>
      </Waterfall>

      <div v-if="list.length" class="al-c f-center" style="height: 60px">
        <div class="pa-5" v-if="page > 1 && curList.length && listLoading">
          <div class="al-c f-center">
            <div class="loader-1">
              <div class="loader-2"></div>
            </div>
            <span class="ml-2">Loading...</span>
          </div>
          <div class="fz-14 ta-c">
            This file may take a few moments to load, please wait.
          </div>
        </div>
        <div v-if="!curList.length" class="fz-14">No More</div>
      </div>
    </div>

    <div
      v-if="(!list.length && !listLoading) || loadFailed"
      class="no-content h-flex al-c f-center"
    >
      <img
        v-if="loadFailed"
        src="@/assets/img/imgs/content-load-failed.png"
        width="270"
        alt=""
      />
      <img v-else src="@/assets/img/imgs/no-content.png" width="270" alt="" />
      <p v-if="loadFailed" class="ta-c fz-14">
        Loading failed, please try again later.
      </p>
      <p v-else class="ta-c fz-14">
        No content available to display.
        <span class="cursor-p" @click="handleUpload" style="color: #9747ff"
          >Upload</span
        >
        something now!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// import NavHeader from "@/components/nav-header/nav-header.vue";
import ClassifyBar from "@/components/classify-bar/classify-bar.vue";
// import CardControl from "@/components/card-control/card-control.vue";
import Card from "@/components/card/card.vue";
import Avatar from "@/components/avatar/avatar.vue";
import { Waterfall } from "vue-waterfall-plugin-next";
import ListSkeleton from "@/components/list-skeleton/list-skeleton.vue";
import "vue-waterfall-plugin-next/dist/style.css";
import { ref, getCurrentInstance, ComponentInternalInstance } from "vue";
import { fetchHomeList, handleThumbup } from "@/request/main/main";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import emitBus from "@/utils/mitt";
import { debounce, getLikeNum } from "@/utils";
import error from "@/assets/img/imgs/load-failed.png";
import { IItemInfo } from "@/request/type";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const store = useStore();
const router = useRouter();
let list = ref<IItemInfo[]>([]);
let curList = ref<IItemInfo[]>([]);
let page = ref(1);
let loadFailed = ref(false);
const listLoading = ref(false);

const handleUpload = () => {
  if (!localStorage.token) {
    emitBus.emit("onShowConnect");
  } else {
    emitBus.emit("handleUpload");
  }
};
const getList = async (isReload = false, sortType = "DEFAULT") => {
  try {
    if (isReload) {
      list.value = [];
    }
    listLoading.value = true;
    const data = await fetchHomeList(store.state.topic, page.value, sortType);
    page.value++;
    list.value?.push(...data);
    curList.value = data;
  } catch (error: any) {
    loadFailed.value = true;
    proxy!.$message({
      customClass: "normal",
      icon: "",
      message: error.message,
    });
  }
  listLoading.value = false;
};
getList();
const onLike = async (item: IItemInfo) => {
  if (item.thumbed) return;
  proxy!.$loading("loading...");
  try {
    const code = await store.dispatch("getCode", { scope: "like" });
    await handleThumbup(store.state.topic, item.id.toString(), code);
    list.value.find((it) => {
      if (it.id == item.id) {
        it.thumbed = true;
        it.thumbs += 1;
      }
    });
    await store.dispatch("getUserInfo");
  } catch (error: any) {
    proxy!.$message({
      customClass: "normal",
      icon: "",
      message: error.message,
    });
  }
  proxy!.$loading.close();
};

const handleDetail = ({ id }: { id: string }) => {
  router.push("/detail/" + id);
};

const listenBottomOut = () => {
  if (listLoading.value) return;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  if (scrollTop + clientHeight >= scrollHeight) {
    if (curList.value?.length) {
      getList();
    }
    // console.log('bottom load')
    return;
  }
};
window.addEventListener("scroll", debounce(listenBottomOut, 500));

emitBus.on("getList", (isReload: any) => {
  if (isReload) page.value = 1;
  getList(isReload);
});

emitBus.on("updateInfo", ({ id, type }: any) => {
  if (type == "like") {
    list.value.find((it) => {
      if (it.id == id) {
        it.thumbed = true;
        it.thumbs += 1;
      }
    });
  } else {
    list.value.find((it) => {
      if (it.id == id) {
        it.sticked = !it.sticked;
      }
    });
  }
});
emitBus.on("change", (sortType: any) => {
  page.value = 1;
  getList(true, sortType);
});
</script>

<style>
.lazy__box {
  background: #f3f3f6;
}
.lazy__img[lazy="error"] {
  width: 80px !important;
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .water-fall {
    padding: 0 16px !important;
  }
  .contributor-info {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start;
    font-size: 14px;

    .creator {
      width: auto;
      margin-bottom: 8px;
    }
  }
}
.home-container {
  width: 100%;
  // height: calc(100vh - 82px);
  .water-fall {
    padding: 0 64px;
  }
}
.no-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #0e0e2c;
}

.creator {
  width: 70%;
  .address {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.loader-1 {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #0e0e2c;
  border-left-color: transparent;
  animation: animate_681 1.5s linear infinite;
  position: relative;
}

.loader-2 {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #9747ff;
  border-top-color: transparent;
  animation: animate_6810 0.4s linear infinite;
  position: absolute;
  margin: 4px;
}

@keyframes animate_6810 {
  0% {
    transform: rotate(360deg);
  }
}

@keyframes animate_681 {
  0% {
    transform: rotate(-360deg);
  }
}
</style>
