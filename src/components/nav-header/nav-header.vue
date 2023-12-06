<template>
  <div class="header-container h-flex">
    <div class="al-c space-btw">
      <h2 class="project-title cursor-p" @click="() => router.push('/home')">
        {{ store.state.topic }}
      </h2>
      <div class="home-icon pa-2" @click="() => router.push('/home')">
        <img src="@/assets/img/icon/home-icon.svg" width="32" alt="" />
      </div>
      <div class="al-c">
        <div class="user-info-topic">
          <span class="data-property fz-14">My Points</span>
          <span class="data-value ml-2">{{
            userInfo.posts.toLocaleString()
          }}</span>
        </div>
        <div class="user-info-topic ml-8">
          <span class="data-property fz-14">Portion</span>
          <span class="data-value ml-2">{{ userInfo.ratio }}%</span>
        </div>

        <div
          class="m-upload-btn ml-8 al-c cursor-p"
          @click="handleUpload(true)"
        >
          <img src="@/assets/img/icon/upload1.svg" width="32" alt="" />
        </div>
        <div class="upload-btn ml-8 al-c cursor-p" @click="handleUpload(false)">
          <img src="@/assets/img/icon/upload1.svg" width="32" alt="" />
          <span class="ml-2 upload-text">UPLOAD</span>
        </div>

        <div class="user-menu ml-2 py-3" v-if="logined">
          <div class="al-c login-btn cursor-p">
            <avatar class="avatar" :address="store.state.address"></avatar>
            <span class="ml-1">{{ store.state.address.cutStr(6, 6) }}</span>
          </div>
          <div class="sub-menu">
            <div class="sub-menu-item al-c cursor-p" @click="handleDisconnect">
              <img src="@/assets/img/icon/disconnect.svg" width="20" alt="" />
              <span class="ml-2">Disconnet</span>
            </div>
          </div>
        </div>
        <div
          class="logined-btn ml-2 al-c cursor-p"
          @click="showConnect = true"
          v-else
        >
          <img src="@/assets/img/icon/wallet.svg" width="32" alt="" />
          <span class="ml-2">CONNECT</span>
        </div>
      </div>

      <el-dialog
        v-model="showConnect"
        class="login-platform"
        align-center
        :show-close="false"
      >
        <template #header>
          <div class="login-platform-header">
            <img src="@/assets/img/imgs/login-dialog.png" width="170" alt="" />
            <div class="fw-b fz-20 my-5 header ta-c">
              <span> Connect Your Wallet </span>
              <div
                class="close-btn al-c f-center cursor-p"
                @click="showConnect = false"
              >
                <img src="@/assets/img/icon/close.svg" width="24" alt="" />
              </div>
            </div>
          </div>
        </template>
        <template v-for="item in walletPlatform" :key="item.name">
          <div
            @click="handleConnect"
            class="al-c plateform py-3 f-center cursor-p"
          >
            <img width="32" :src="item.img" alt="" />
            <span class="ml-3 fz-16 fw-b">
              {{ item.name }}
            </span>
          </div>
        </template>
      </el-dialog>
    </div>
    <m-date></m-date>
  </div>
</template>

<script setup lang="ts">
import MDate from "@/components/m-date/m-date.vue";
import avatar from "@/components/avatar/avatar.vue";
import emitBus from "@/utils/mitt";
import {
  computed,
  reactive,
  ref,
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const logined = computed(() => {
  return store.state.address && store.state.token;
});
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const userInfo = computed(() => {
  return store.state.userInfo;
});
const showConnect = ref(false);
const walletPlatform = reactive([
  { name: "MetaMask", img: require("../../assets/img/imgs/metamask.png") },
]);

emitBus.on("onShowConnect", () => {
  showConnect.value = true;
});

const checkAccountCache = (account: string) => {
  const accountTokens = JSON.parse(
    localStorage.getItem("account-tokens") ?? "{}"
  );
  return accountTokens[account];
};

const accountChangedTrigger = (account: string) => {
  let accountInfo = checkAccountCache(account);
  if (accountInfo) {
    localStorage.token = accountInfo.token;
    localStorage.address = accountInfo.address.toLocaleLowerCase();
    store.commit("SET_USER_INFO", {
      token: accountInfo.token,
      address: accountInfo.address.toLocaleLowerCase(),
    });
    store.dispatch("getUserInfo");
    emitBus.emit("getList", true);
  } else {
    handleConnect();
  }
};

window.ethereum.on("accountsChanged", async (accounts: string[]) => {
  console.log("accountsChanged", accounts);
  accountChangedTrigger(accounts[0]);
});

const handleConnect = async () => {
  try {
    if (!window.ethereum) return window.open("https://metamask.io/");
    showConnect.value = false;
    await store.dispatch("getCode", { scope: "login" });
    await store.dispatch("getUserInfo");
    // await store.dispatch("getSts");
    emitBus.emit("getList", true);
  } catch (error: any) {
    proxy!.$message({
      customClass: "normal",
      icon: "",
      message: error.message,
    });
  }
};
const handleUpload = (isMobile = false) => {
  if (store.state.token) {
    emitBus.emit("handleUpload", isMobile);
  } else {
    showConnect.value = true;
  }
};

const handleDisconnect = () => {
  const accountTokens = JSON.parse(
    localStorage.getItem("account-tokens") ?? "{}"
  );
  delete accountTokens[localStorage.address];
  localStorage.setItem("account-tokens", JSON.stringify(accountTokens));
  localStorage.removeItem("token");
  localStorage.removeItem("address");
  location.reload();
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .header-container {
    padding: 16px !important;
    .project-title,
    .user-info-topic,
    .upload-btn,
    .avatar {
      display: none;
    }
    .home-icon {
      display: block !important;
    }
    .user-menu {
      margin-left: 8px !important;
    }
    :deep .login-platform {
      width: 90%;
    }
    .m-upload-btn {
      display: block !important;
    }
    .close-btn {
      width: 30px !important;
      height: 30px !important;
      img {
        width: 18px !important;
        height: 18px !important;
      }
    }
  }
}
:deep .el-dialog__header {
  margin-right: 0 !important;
}
:deep .login-platform {
  width: 528px;
  border-radius: 12px;
  .login-platform-header {
    position: relative;
    .header {
      position: relative;
    }
    .close-btn {
      position: absolute;
      right: 0;
      top: -17px;
      width: 56px;
      height: 56px;
      border: 2px solid rgba(140, 140, 161, 0.25);
      border-radius: 50%;
    }
    > img {
      position: absolute;
      left: 50%;
      top: -130px;
      transform: translateX(-50%);
    }
  }
}
.plateform {
  background: rgba(140, 140, 161, 0.05);
  border-radius: 8px;
}
.header-container {
  position: sticky;
  top: 0;
  z-index: 99;
  width: 100%;
  padding: 6px 64px;
  box-shadow: 0px 2px 4px rgba(140, 140, 161, 0.05);
  background: #fff;
  box-sizing: border-box;

  .project-title {
    font-size: 32px;
    margin: 0;
  }
  .home-icon {
    display: none;
    border-radius: 8px;
    border: 1px solid rgba(140, 140, 161, 0.25);
  }
  .data-property {
    color: #8c8ca1;
    opacity: 0.75;
    line-height: 22px;
  }
  .data-value {
    font-family: "DIN Alternate";
    color: #0e0e2c;
    font-size: 24px;
    line-height: 30px;
    font-weight: bold;
  }
  .upload-btn {
    padding: 8px 16px;
    color: #fff;
    font-weight: bold;
    background: #9747ff;
    border-radius: 8px;
    letter-spacing: 1px;
  }
  .m-upload-btn {
    padding: 8px !important;
    margin-left: 0px !important;
    color: #fff;
    font-weight: bold;
    background: #9747ff;
    border-radius: 8px;
    letter-spacing: 1px;
    display: none;
  }
  .logined-btn {
    padding: 8px 32px;
    color: #fff;
    font-weight: bold;
    color: #9747ff;
    border-radius: 8px;
    border: 1px solid rgba(151, 71, 255, 0.25);
  }
  .login-btn {
    padding: 8px 16px;
    height: 32px;
    background: rgba(140, 140, 161, 0.15);
    border-radius: 8px;
  }
}
.user-menu {
  position: relative;
  .sub-menu {
    z-index: 999;
    position: absolute;
    width: 100%;
    bottom: -50px;
    padding: 8px 16px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid rgba(140, 140, 161, 0.25);
    background: #fff;
    box-shadow: 0px 4px 8px 0px rgba(14, 14, 44, 0.15);
    display: none;

    .sub-menu-item {
      line-height: 32px;
    }
  }
}

.user-menu:hover .sub-menu {
  display: block;
}
</style>
