<template>
  <div>
    <transition name="loading">
      <div class="loading-container al-c f-center">
        <div class="loader-1"></div>
        <div class="status-text ml-3">{{ text }}</div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineProps<{
  text: string;
}>();
// const fade = ref(false);
// onMounted(() => {
//   setTimeout(() => {
//     fade.value = true;
//   }, 0);
// });
// onBeforeUnmount(() => {
//   fade.value = false;
// });
// export default {
//   props: {
//     show: Boolean,
//     text: String,
//     status: String,
//   },
//   setup() {
//     const fade = ref(false);
//     onMounted(() => {
//       setTimeout(() => {
//         fade.value = true;
//       }, 0);
//     });
//     onBeforeUnmount(() => {
//       fade.value = false;
//     });
//     return { fade };
//   },
// };
</script>

<style lang="scss" scoped>
.loading-container {
  z-index: 999;
  position: fixed;
  left: 50%;
  top: 128px;
  transform: translate(-50%, -50%);
  // width: 363px;
  transform-origin: left top;
  border-radius: 4px;
  padding: 15px 19px;
  border: 1px solid rgba(140, 140, 161);
  background: #eeeef1;
  .status-text {
    text-align: center;
  }
}
.loading-enter-to,
.loading-leave-from {
  opacity: 1;
  transform: scale(1) translate(-50%, -50%);
}
.loading-leave-to,
.loading-enter-from {
  opacity: 0;
  transform: scale(0.5) translate(-50%, -50%);
}

.loading-enter-active,
.loading-leave-active {
  transition: all 0.3s ease;
}
.loader-1 {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #0e0e2c;
  border-left-color: transparent;
  animation: animate_681 1s linear infinite;
  position: relative;
}

@keyframes animate_681 {
  0% {
    transform: rotate(-360deg);
  }
}
</style>
