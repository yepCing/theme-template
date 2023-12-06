import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { VueClipboard } from "@soerenmartius/vue3-clipboard";
import ElementPlus from "element-plus";
import Messagebox from "./components/message-box";
import "@/utils";
import "element-plus/dist/index.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "@/assets/css/index.scss";
const app = createApp(App);
app
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(VueClipboard)
  .use(Messagebox)
  .mount("#app");

store.dispatch("initProject");
