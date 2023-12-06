<template>
  <div class="al-c f-center">
    <el-select
      style="width: 50%"
      v-model="gatewayValue"
      size="large"
      class="gateway-select"
      @change="onChangeGateway"
      placeholder="https://"
    >
      <template #prefix>
        <img src="@/assets/img/icon/select-gateway.svg" width="16" alt="" />
      </template>
      <el-option
        v-for="item in gatewayOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="value"
      size="large"
      @change="onChange"
      style="width: 50%"
    >
      <template #prefix>
        <img src="@/assets/img/icon/select-icon.svg" width="16" alt="" />
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/store";
import emitBus from "@/utils/mitt";
const store = useStore();
const value = ref("DEFAULT");
const gatewayValue = ref(localStorage.gateway);
const options = [
  {
    label: "Featured",
    value: "DEFAULT",
  },
  {
    label: "Trending",
    value: "HOT",
  },
  {
    label: "Latest",
    value: "NEW",
  },
];

const gatewayOptions = computed(() => {
  let options = [
    {
      label: "4everland.io",
      value: "https://ipfs.4everland.io/ipfs/",
    },
    {
      label: "cloudflare-ipfs.com",
      value: "https://cloudflare-ipfs.com/ipfs/",
    },
    {
      label: "ipfs.io",
      value: "https://ipfs.io/ipfs/",
    },
  ];
  if (store.state.configObj.ipfsGateway) {
    let arr = options.filter((it) => {
      return new RegExp(store.state.configObj.ipfsGateway).test(it.value);
    });
    if (!arr.length) {
      let value = "";
      let i = store.state.configObj.ipfsGateway.lastIndexOf("/");
      if (i == store.state.configObj.ipfsGateway.length - 1) {
        value = store.state.configObj.ipfsGateway + "ipfs/";
      } else {
        value = store.state.configObj.ipfsGateway + "/ipfs/";
      }
      options.unshift({
        label: store.state.configObj.ipfsGateway
          .replace("https://", "")
          .replace("/", ""),
        value,
      });
    }
  }
  return options;
});

const onChange = (sortType: string) => {
  emitBus.emit("change", sortType);
};
const onChangeGateway = (gateway: string) => {
  store.commit("SET_GATEWAY", gateway);
  localStorage.gateway = gateway;
  location.reload();
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  :deep .el-select {
    margin: 10px 0 0 0 !important;
  }
  :deep .el-select.gateway-select {
    margin-right: 20px !important;
  }
}
:deep .el-select.gateway-select {
  margin-right: 20px;
}
:deep .el-select {
  margin-top: 0;
}
</style>
