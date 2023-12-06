import LoadingInstance from "./loading";
import confirmInstance from "./confirm";
import type { App } from "vue";
interface IMessageBox {
  install: (app: App) => void;
}
const Messagebox: IMessageBox = {
  install(app) {
    app.config.globalProperties.$confirm = confirmInstance;
    app.config.globalProperties.$loading = LoadingInstance;
  },
};

export default Messagebox;
