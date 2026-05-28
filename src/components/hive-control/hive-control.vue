<template>
  <div class="hive-control al-c">
    <div class="mr-6">
      <span class="mr-2 title">Floor Price</span>
      <span class="fw-b">{{ formatEther(overview.price) }} BNB/Honey</span>
    </div>
    <div class="mr-6">
      <span class="mr-2 title"> Volume </span>
      <span class="fw-b">{{ formatEther(overview.pool) }}BNB</span>
    </div>
    <div class="act-btn" @click="handleClick(true)">Buy</div>
    <div class="act-btn ml-2" @click="handleClick(false)">Sell</div>
    <div class="act-btn ml-2" @click="handleDetail">Details</div>

    <el-dialog
      v-model="showDialog"
      align-center
      :show-close="false"
      class="transaction-dialog"
    >
      <template #header>
        <div class="fw-b fz-20 my-5 header ta-c al-c f-center">
          <span class="fz-20 fw-b">Add Contributor</span>
          <div
            class="close-btn al-c f-center cursor-p"
            @click="showDialog = false"
          >
            <img src="@/assets/img/icon/close.svg" width="24" alt="" />
          </div>
        </div>
      </template>
      <div class="hive-info">
        <avatar
          class="f-center"
          :diameter="64"
          :address="store.state.address"
        ></avatar>

        <div class="al-c space-btw mt-6">
          <span class="fw-b fz-20">{{ overview.hiveName }}</span>
          <span class="fw-b">{{ showPrice }} BNB</span>
        </div>
        <div class="al-c space-btw mt-6">
          <div class="fz-20">
            You Own
            <span class="fw-b" style="color: #f9cc45">{{
              overview.holds
            }}</span>
            Honey
          </div>
          <div class="al-c">
            <span class="fw-b">{{ isBuy ? "Honey" : "Sell" }} Price</span>

            <el-tooltip
              class="box-item"
              effect="dark"
              v-show="isBuy"
              placement="bottom"
            >
              <template #content>
                <div style="width: 200px">
                  The price of the next honey is equal to S^2 / 16000 * 1 ether,
                  where S is the current number of honey.
                </div>
              </template>
              <img
                class="ml-1"
                src="../../assets/img/icon/help.svg"
                width="16"
                alt=""
              />
            </el-tooltip>
          </div>
        </div>

        <div class="mt-6 al-c f-center">
          <h-button
            :loading="transactionLoading"
            @click="handleConfirm"
            :disabled="!isBuy && overview.holds == '0'"
          >
            <span class="fw-b">{{ isBuy ? "Buy Honey" : "Sell Honey" }}</span>
          </h-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Hive__factory } from "@hivehoney/hive";
import { ethers, formatEther } from "ethers";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import emitBus from "@/utils/mitt";
import { ElMessage } from "element-plus";
import avatar from "../avatar/avatar.vue";
import HButton from "@/components/h-button/h-button.vue";

const store = useStore();
const router = useRouter();
const curPrice = ref(0);
const hiveAddr = process.env.VUE_APP_HIVE_CONTRACT_ADDR;
const overview = computed(() => {
  return store.state.overview;
});
const transactionLoading = ref(false);
const logined = computed(() => {
  return store.state.address && store.state.token;
});
const showPrice = computed(() => {
  const price = curPrice.value.toString();
  return formatEther(price);
});
const contractName = computed(() => {
  return store.state.topic + "::" + overview.value.hiveName;
});
const showDialog = ref(false);
let isBuy = ref(true);

const getPrice = async (buy: boolean) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const Hive = Hive__factory.connect(hiveAddr, signer);
  if (buy) {
    const price = await Hive.getBuyPriceAfterFee(contractName.value, 1);
    curPrice.value = price;
    console.log(price);
  } else {
    const price = await Hive.getSellPriceAfterFee(contractName.value, 1);
    console.log(price);
    curPrice.value = price;
  }
};

const handleClick = async (buy: boolean) => {
  try {
    if (!logined.value) return emitBus.emit("onShowConnect");
    // switch network
    await store.dispatch("switchNetwork", process.env.VUE_APP_BSC_CHAIN_ID);
    isBuy.value = buy;
    showDialog.value = true;
    await getPrice(buy);
  } catch (error: any) {
    ElMessage({
      type: "error",
      message: error.message,
    });
  }
};
const handleDetail = () => {
  if (!logined.value) return emitBus.emit("onShowConnect");

  router.push("/" + store.state.topic + "/hive");
};

const handleConfirm = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const Hive = Hive__factory.connect(hiveAddr, signer);
    transactionLoading.value = true;
    if (isBuy.value) {
      const tx = await Hive.buyShares(contractName.value, 1, curPrice);
      await tx.wait();
    } else {
      const tx = await Hive.sellShares(contractName.value, 1, curPrice);
      await tx.wait();
    }
    transactionLoading.value = false;
    showDialog.value = false;

    ElMessage({
      type: "success",
      message: "success!!",
    });
    location.reload();
  } catch (error: any) {
    console.log(error);
    transactionLoading.value = false;
    let message = error.message;
    if (/user rejected action/.test(error.message)) {
      message = "user rejected action";
    } else if (/Insufficient payment/.test(error.message)) {
      message = "Insufficient payment";
    }
    ElMessage({
      type: "error",
      message: message,
    });
  }
};
</script>

<style scoped lang="scss">
.hive-control {
  font-family: "Inter";
  .title {
    color: #667085;
    opacity: 0.75;
    font-size: 14px;
  }
  .act-btn {
    padding: 8px 24px;
    font-weight: bold;
    border-radius: 8px;
    border: 1px solid #f9cc45;
    cursor: pointer;
  }
}
:deep .transaction-dialog {
  width: 528px;
  border-radius: 12px;
  .close-btn {
    position: absolute;
    right: 24px;
    top: 24px;
    width: 56px;
    height: 56px;
    border: 2px solid rgba(140, 140, 161, 0.25);
    border-radius: 50%;
  }
}
.hive-info {
  color: #0f172a;
  font-size: 16px;
}
</style>
