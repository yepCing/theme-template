<template>
  <div class="card-control">
    <div
      class="is-top btn al-c pa-2"
      v-if="store.getters.isManager || info.sticked"
    >
      <img
        :src="
          info.sticked
            ? require('@/assets/img/icon/top.svg')
            : require('@/assets/img/icon/untop.svg')
        "
        width="20"
        alt=""
        @click.stop="handleSticked"
      />
    </div>
    <div
      class="trash-btn btn pa-2"
      @click.stop="handleDelete"
      v-if="store.getters.isManager"
    >
      <img src="@/assets/img/icon/trash.svg" width="20" alt="" />
    </div>
    <div class="operation-bar al-c">
      <div class="btn pa-2" @click.stop="onLike">
        <img
          :src="
            info.thumbed
              ? require('@/assets/img/icon/like.svg')
              : require('@/assets/img/icon/unlike.svg')
          "
          width="20"
          alt=""
        />
      </div>
      <div class="btn pa-2 ml-3" @click.stop="handleDownload(gateway, info)">
        <img src="@/assets/img/icon/download.svg" width="20" alt="" />
      </div>
      <div
        class="btn pa-2 ml-3"
        @click.stop
        v-clipboard:copy="shareLink"
        v-clipboard:success="onSuccess"
      >
        <img src="@/assets/img/icon/share.svg" width="20" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComponentInternalInstance, computed, getCurrentInstance } from "vue";
import { useStore } from "@/store";
// import { request } from "@/request";

import {
  handleSticky,
  handleUnSticky,
  handleDeleteItem,
  handleThumbup,
} from "@/request/main/main";
import emitBus from "@/utils/mitt";
import { handleDownload } from "@/utils";
import Copied from "@/components/icon/copied.vue";
import Deleted from "@/components/icon/deleted.vue";
import Pinned from "@/components/icon/pinned.vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const store = useStore();
const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
});
const gateway = computed(() => {
  return store.state.gateway;
});
const shareLink = computed(() => {
  return store.state.gateway + props.info.cid;
});

const handleSticked = async () => {
  try {
    if (!store.getters.isManager) return;
    proxy!.$loading("loading...");
    if (props.info.sticked) {
      const code = await store.dispatch("getCode", { scope: "unpin" });

      await handleUnSticky(store.state.topic, props.info.id, code);
      proxy!.$message({
        customClass: "success",
        icon: Pinned,
        message: "Unpinned",
      });
    } else {
      const code = await store.dispatch("getCode", { scope: "pin" });
      await handleSticky(store.state.topic, props.info.id, code);
      proxy!.$message({
        customClass: "success",
        icon: Pinned,
        message: "Pinned",
      });
    }
    emitBus.emit("updateInfo", { id: props.info.id, type: "pin" });
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
    const code = await store.dispatch("getCode", { scope: "delete" });

    await handleDeleteItem(store.state.topic, props.info.id, code);
    emitBus.emit("getList", true);
    // Update User Info
    await store.dispatch("getUserInfo");
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
const onLike = async () => {
  if (props.info.thumbed) return;
  proxy!.$loading("loading...");
  try {
    const code = await store.dispatch("getCode", { scope: "like" });
    await handleThumbup(store.state.topic, props.info.id, code);
    emitBus.emit("updateInfo", { id: props.info.id, type: "like" });
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
const onSuccess = () => {
  proxy!.$message({
    customClass: "success",
    icon: Copied,
    message: "Share via clipboard",
  });
};
</script>

<style lang="scss" scoped>
.card-control {
  position: absolute;
  z-index: 999;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .is-top {
    display: inline-block;
    position: absolute;
    left: 8px;
    top: 8px;
    border-radius: 8px;
    color: #fff;
  }
  .trash-btn {
    position: absolute;
    right: 8px;
    top: 8px;
  }
  .btn {
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.75);
    cursor: pointer;
  }
  .operation-bar {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
