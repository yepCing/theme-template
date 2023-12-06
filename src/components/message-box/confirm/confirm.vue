<template>
  <div class="confirm" :class="{ fade: fade }">
    <div class="wrapper py-10" :class="{ fade: fade }">
      <div class="title fz-20 ta-c fw-b">{{ title }}</div>
      <div class="body ta-c fw-b">
        {{ text }}
      </div>
      <div class="al-c f-center">
        <div
          @click="cancelCallback"
          class="operation-btn cancel-btn py-4 fw-b fz-20 ta-c cursor-p"
        >
          Cancel
        </div>
        <div
          @click="submitCallback"
          class="operation-btn confirm-btn py-4 fw-b fz-20 ta-c ml-4 cursor-p"
        >
          OK
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onUpdated } from "vue";
defineProps<{
  title: string;
  text: string;
  cancelCallback: any;
  submitCallback: any;
}>();
const fade = ref(false);
onUpdated(() => {
  console.log("----------xtx-confirm--------");
});
onMounted(() => {
  setTimeout(() => {
    fade.value = true;
  }, 0);
});
</script>
<style scoped lang="scss">
.confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0, 0, 0, 0);
  &.fade {
    transition: all 0.4s;
    background: rgba(0, 0, 0, 0.5);
  }
  .wrapper {
    width: 528px;
    background: #fff;
    border-radius: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    .title {
      color: #0e0e2c;
      line-height: 23px;
    }
    .body {
      padding: 40px;
      font-size: 16px;
      color: #0e0e2c;
    }
    .operation-btn {
      width: 168px;
      background: rgba(140, 140, 161, 0.25);
      border-radius: 12px;
      color: #8c8ca1;
    }
    .confirm-btn {
      color: #fff;
      background: #9747ff;
    }
    .header {
      position: relative;
    }
  }
}
</style>
