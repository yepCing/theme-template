<template>
  <div class="hive-container px-10">
    <div class="hive-content mt-6">
      <div class="al-c f-center">
        <avatar
          class="avatar"
          :diameter="64"
          :address="store.state.address"
        ></avatar>
      </div>
      <div class="mt-2 hive-name ta-c">{{ overview.hiveName }}</div>
      <div class="hive-info my-6">
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="h-flex al-c">
              <span class="value">{{ overview.holds }}</span>
              <span class="mt-2 key">My Honey</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="h-flex al-c">
              <span class="value">{{ overview.total }}</span>
              <span class="mt-2 key">Honey Supply</span>
            </div></el-col
          >
          <el-col :span="6">
            <div class="h-flex al-c">
              <span class="value">{{ formatEther(overview.pool) }}BNB</span>
              <span class="mt-2 key">Total Value In The Pool</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="h-flex al-c">
              <span class="value">{{ formatEther(overview.journal) }}BNB</span>
              <span class="mt-2 key">Total Trading Volume</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="tabs al-c f-center">
      <div class="tab" :class="{ actived: curIdx == 0 }" @click="curIdx = 0">
        Recent Trades
      </div>
      <div class="tab" :class="{ actived: curIdx == 1 }" @click="curIdx = 1">
        Holders
      </div>
    </div>

    <div class="list">
      <div v-show="curIdx == 0">
        <div class="fw-b fz-20 mt-4">{{ tradeList.length }} Trades</div>
        <div
          v-for="(item, index) in tradeList"
          class="trade al-c mt-4"
          :key="item.id"
        >
          <div class="type fw-b">
            {{
              tradeList.length == index + 1
                ? "MINTED"
                : item.isBuy
                ? "BOUGHT"
                : "SOLD"
            }}
          </div>
          <div class="info ml-4 fz-14">
            {{ item.trader.cutStr(6, 6) }} {{ item.isBuy ? "Buy" : "Sold" }}
            {{ item.shareAmount }} Honey For
            {{ formatEther(item.ethAmount) }} BNB
          </div>
        </div>
      </div>
      <div v-show="curIdx == 1">
        <div class="fw-b fz-20 mt-4">{{ holderList.length }} Holders</div>
        <table
          style="width: 100%; border-collapse: separate; border-spacing: 0 10px"
          cellSpacing="0"
          cellPadding="0"
        >
          <thead>
            <tr>
              <th>Holder</th>
              <th>Honey</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in holderList" :key="index">
              <td>{{ item.address.cutStr(6, 6) }}</td>
              <td>{{ item.holds }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/avatar/avatar.vue";
import { useStore } from "@/store";
import { ref, computed } from "vue";
import { formatEther } from "ethers";
import { fetchHolders, fetchTrades } from "@/request/main/main";
import type { Holder, Trade } from "@/request/main/type";
const store = useStore();
const curIdx = ref(0);
const holderList = ref<Holder[]>([]);
const tradeList = ref<Trade[]>([]);
const overview = computed(() => {
  return store.state.overview;
});
const getTrades = async () => {
  try {
    const data = await fetchTrades(store.state.topic);
    console.log(data);
    tradeList.value = data;
  } catch (error) {
    console.log(error);
  }
};
const getHolder = async () => {
  try {
    const data = await fetchHolders(store.state.topic);
    console.log(data);
    holderList.value = data;
  } catch (error) {
    console.log(error);
  }
};
getTrades();
getHolder();
</script>

<style scoped lang="scss">
.hive-container {
  font-family: "Inter";
  color: #0f172a;
  .hive-content {
    .hive-name {
      font-size: 32px;
      font-weight: bold;
    }
    .hive-info {
      margin: 24px auto;
      width: 688px;
      .value {
        font-size: 16px;
        font-weight: bold;
      }
      .key {
        font-size: 14px;
        line-height: 22px;
        color: #667085;
      }
    }
  }
  .tabs {
    border-bottom: 1px solid #d0d5dd;
    .tab {
      padding: 20px 16px;
      color: #667085;
      font-weight: bold;
      cursor: pointer;
    }
    .tab.actived {
      color: #f9cc45;
      border-bottom: 1px solid #f9cc45;
    }
  }

  .list {
    width: 640px;
    margin: 0 auto;
    .trade {
      padding: 16px 8px;
      border-radius: 8px;
      border: 1px solid #d0d5dd;

      .type {
        width: 64px;
      }
      .info {
      }
    }
  }
  table {
    th,
    td {
      text-align: left;
    }
    th {
      padding: 0 16px;
      font-size: 12px;
      color: #667085;
      font-weight: normal;
    }

    .table-content {
      margin-top: 16px;
    }
    td {
      padding: 16px !important;
      border-top: 1px solid #cbd5e1 !important;
      border-bottom: 1px solid #cbd5e1 !important;
      margin: 10px 0 !important;
    }
    tr td:first-child {
      border-left: 1px solid #cbd5e1 !important;
      border-right: none !important;
      border-radius: 8px 0 0 8px;
    }
    tr td:last-child {
      border-right: 1px solid #cbd5e1 !important;
      border-left: none !important;
      border-radius: 0 8px 8px 0;
    }
  }
}
</style>
