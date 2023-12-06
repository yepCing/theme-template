import { createVNode, render } from "vue";
import Confirm from "./confirm.vue";

const container = document.createElement("div");
container.setAttribute("class", "confirm-container");
document.body.appendChild(container);
export default ({ title, text }: { title: string; text: string }) => {
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      render(null, container);
      resolve(1);
    };
    const cancelCallback = () => {
      render(null, container);
      reject("cancel");
    };
    const vnode = createVNode(Confirm, {
      title,
      text,
      cancelCallback,
      submitCallback,
    });
    render(vnode, container);
  });
};
