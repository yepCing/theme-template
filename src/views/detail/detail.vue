<template>
  <div class="detail-container">
    <div class="detail-content d-flex" v-if="!info">
      <!-- <div class="detail-content d-flex" v-if="true"> -->
      <div class="flex-1">
        <el-skeleton style="height: 100%" animated>
          <template #template>
            <el-skeleton-item variant="image" style="height: 100%" />
          </template>
        </el-skeleton>
      </div>
      <div class="detail-info h-flex space-btw"></div>
    </div>

    <div class="detail-content d-flex" v-else>
      <img-preview
        :cid="info.cid"
        :type="info.type"
        :controls="true"
        detailPage
      ></img-preview>
      <div class="detail-info h-flex space-btw">
        <div class="info">
          <div class="info-header al-c space-btw">
            <div class="al-c fz-14">
              <span>CID: </span>
              <span class="ml-1">{{ info.cid.cutStr(5, 4) }}</span>
              <img
                class="ml-3 cursor-p"
                src="@/assets/img/icon/copy.svg"
                width="16"
                alt=""
                v-clipboard:copy="info.cid"
                v-clipboard:success="onSuccess"
              />
            </div>
            <div class="al-c">
              <img
                v-if="store.getters.isManager || info.sticked"
                :src="
                  info.sticked
                    ? require('@/assets/img/icon/top.svg')
                    : require('@/assets/img/icon/untop.svg')
                "
                class="cursor-p"
                width="24"
                alt=""
                @click="handleSticked"
              />
              <img
                v-if="store.getters.isManager"
                src="@/assets/img/icon/trash.svg"
                class="ml-6 cursor-p"
                width="24"
                alt=""
                @click="handleDelete"
              />
            </div>
          </div>
          <h2 class="info-title mt-2">{{ info.title }}</h2>
          <div class="info-desc mt-4 fz-14">
            {{ info.content }}
          </div>
          <div class="al-c mt-6">
            <avatar :address="info.creator"></avatar>
            <span class="ml-2">{{ info.creator.cutStr(6, 6) }}</span>
          </div>
        </div>
        <div style="height: 50px"></div>
        <div class="opeartion-bar al-c space-btw">
          <div class="al-c">
            <img
              :src="
                info.thumbed
                  ? require('@/assets/img/icon/like.svg')
                  : require('@/assets/img/icon/unlike.svg')
              "
              width="24"
              alt=""
              class="cursor-p"
              @click="onLike"
            />
            <span class="ml-2">{{ getLikeNum(info.thumbs) }} Like </span>
          </div>
          <div class="al-c">
            <img
              @click="handleDownload(store.state.gateway, info)"
              src="@/assets/img/icon/download.svg"
              class="cursor-p"
              width="24"
              alt=""
            />
            <img
              v-clipboard:copy="shareLink"
              v-clipboard:success="onSuccess"
              src="@/assets/img/icon/share.svg"
              class="ml-3 cursor-p"
              width="24"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/avatar/avatar.vue";
import ImgPreview from "@/components/img-preview/img-preview.vue";
import {
  ref,
  getCurrentInstance,
  computed,
  ComponentInternalInstance,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import {
  fetchDetailInfo,
  handleSticky,
  handleUnSticky,
  handleThumbup,
  handleDeleteItem,
} from "@/request/main/main";
import { handleDownload, getLikeNum } from "@/utils";
import Copied from "@/components/icon/copied.vue";
import Pinned from "@/components/icon/pinned.vue";
import Deleted from "@/components/icon/deleted.vue";
import { IItemInfo } from "@/request/type";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();
const router = useRouter();
const store = useStore();
const info = ref<IItemInfo>();
const id = route.params.id as string;

const shareLink = computed(() => {
  return store.state.gateway + info.value?.cid;
});
const getInfo = async () => {
  try {
    const data = await fetchDetailInfo(store.state.topic, id);
    info.value = data;
  } catch (error: any) {
    proxy!.$message({
      customClass: "normal",
      icon: "",
      message: error.message,
    });
  }
};
const onSuccess = () => {
  proxy!.$message({
    customClass: "success",
    icon: Copied,
    message: "Share via clipboard",
  });
};
const handleSticked = async () => {
  try {
    if (!store.getters.isManager) return;
    proxy!.$loading("loading...");
    if (info.value?.sticked) {
      const code = await store.dispatch("getCode", { scope: "unpin" });
      await handleUnSticky(store.state.topic, id, code);
      proxy!.$message({
        customClass: "success",
        icon: Pinned,
        message: "Unpinned",
      });
    } else {
      const code = await store.dispatch("getCode", { scope: "pin" });
      await handleSticky(store.state.topic, id, code);

      proxy!.$message({
        customClass: "success",
        icon: Pinned,
        message: "Pinned",
      });
    }
    await getInfo();
  } catch (error: any) {
    proxy!.$message({
      customClass: "normal",
      icon: "",
      message: error.message,
    });
  }
  proxy!.$loading.close();
};
const onLike = async () => {
  if (info.value?.thumbed) return;
  proxy!.$loading("loading...");
  try {
    const code = await store.dispatch("getCode", { scope: "like" });

    await handleThumbup(store.state.topic, id, code);
    await getInfo();
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
const handleDelete = async () => {
  proxy!.$loading("loading...");
  try {
    const code = await store.dispatch("getCode", { scope: "deleted" });

    await handleDeleteItem(store.state.topic, info.value!.id.toString(), code);
    // Update User Info
    await store.dispatch("getUserInfo");
    router.push("/home");
    // Update List Length
    await store.dispatch("getProjectInfo");
    proxy!.$message({
      customClass: "normal",
      icon: Deleted,
      message: "Deleted",
    });
  } catch (error: any) {
    proxy!.$message({
      customClass: "normal",
      icon: "",
      message: error.message,
    });
  }
  proxy!.$loading.close();
};

getInfo();
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .detail-container {
    padding: 0 !important;
    .detail-content {
      flex-direction: column;
      border: none;
      border-radius: 0;
      overflow: auto;
      .detail-info {
        width: auto;
        .info {
          padding: 16px;
        }
        .opeartion-bar {
          position: fixed;
          width: 100%;
          bottom: 0;
          padding: 12px 16px;
          box-sizing: border-box;
          background: #fff;
          border-top: 1px solid rgba(140, 140, 161, 0.25);
        }
      }
    }
  }
}
.detail-container {
  height: calc(100vh - 88px);
  padding: 40px;
  box-sizing: border-box;
}
.detail-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0 auto 0;
  border: 1px solid rgba(140, 140, 161, 0.25);
  border-radius: 24px;
  overflow: hidden;
  .detail-info {
    width: 384px;
    box-sizing: border-box;
    .info {
      padding: 24px;
    }
    .info-header {
      color: #8c8ca1;
      line-height: 16px;
    }
    .info-title {
      font-size: 24px;
    }
    .info-desc {
      word-wrap: break-word;
      color: #8c8ca1;
      line-height: 18px;
      opacity: 0.75;
    }
    .opeartion-bar {
      padding: 24px;
    }
  }
}
</style>
