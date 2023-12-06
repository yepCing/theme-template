import { createApp } from "vue";
import type { App } from "vue";
import Loading from "./loading.vue";

const container = document.createElement("div");
container.setAttribute("class", "confirm-container");
document.body.appendChild(container);

// let vnode: VNode;
// const LoadingInstance = (text: string) => {
//   vnode = createVNode(Loading, {
//     text,
//   });
//   render(vnode, container);
// };
// LoadingInstance.close = () => {
//   if (vnode && vnode.component) {
//     vnode.component.data.fade = false;
//   }
//   setTimeout(() => {
//     render(null, container);
//   }, 1000);
// };

let el: HTMLElement | null;

let instance: App;

const LoadingInstance = (text: string) => {
  if (el) {
    el.remove();
  }
  instance = createApp(Loading, {
    text,
  });
  el = document.createElement("div");
  instance.mount(el);
  document.body.appendChild(el);
};

LoadingInstance.close = () => {
  if (instance) {
    instance.unmount();
  }
  el?.remove();
};

export default LoadingInstance;
