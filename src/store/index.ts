import { createStore, Store, useStore as useVuexStore } from "vuex";
import { IRootState, IStoreType } from "./type";
import { chainInfo } from "./chainList";
import {
  fetchProjectInfo,
  fetchSignature,
  verifySignature,
  fetchOverview,
} from "@/request/auth/auth";
import { ethers } from "ethers";

const store = createStore<IRootState>({
  state: {
    address: localStorage.address || null,
    token: localStorage.token || null,
    userInfo: { posts: 0, ratio: 0, uid: "" },
    projectInfo: null,
    configObj: null,
    topic: "",
    overview: {
      hiveName: "HIVE NAME",
      holds: "0",
      journal: "0",
      pool: "0",
      price: "0",
      total: "0",
      owner: "",
    },
  },
  getters: {
    isManager(state) {
      if (state.projectInfo) return state.projectInfo.owner == state.address;
      return false;
    },
  },
  mutations: {
    SET_INFO(state, info) {
      state.userInfo = info;
    },
    SET_USER_INFO(state, { address, token }) {
      state.address = address;
      state.token = token;
    },
    SET_PROJECTINFO(state, info) {
      state.projectInfo = info;
    },
    SET_TOPIC(state, topic) {
      state.topic = topic;
    },
    SET_OVERVIEW(state, overview) {
      state.overview = overview;
    },
  },
  actions: {
    async initProject({ commit }, topic) {
      try {
        if (topic) {
          document.title = topic;
        }
        commit("SET_TOPIC", topic);
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    async getProjectInfo({ commit, state }) {
      try {
        const info = await fetchProjectInfo(state.topic);
        commit("SET_PROJECTINFO", info);
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    async getCode({ commit, state }, { scope }) {
      try {
        if (!window.ethereum) {
          throw new Error(
            "Please install Metamask or Open a browser that supports wallets"
          );
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const randomNum = await fetchSignature(
          state.topic,
          signer.address,
          scope
        );

        const signature = await signer.signMessage(randomNum.toString());

        const { code, token, expiredAt } = await verifySignature(
          state.topic,
          signer.address,
          signature
        );

        const addr = signer.address;
        localStorage.token = token;
        localStorage.address = addr;

        const accountTokens = JSON.parse(
          localStorage.getItem("account-tokens") ?? "{}"
        );
        accountTokens[addr] = {
          token,
          address: addr,
          expiredAt: expiredAt,
        };
        localStorage.setItem("account-tokens", JSON.stringify(accountTokens));
        commit("SET_USER_INFO", {
          token,
          address: signer.address,
        });
        return code;
      } catch (error: any) {
        let msg = "";
        const { message } = error;
        console.log(message);
        if (/user rejected/i.test(message)) {
          msg = "user rejected action";
        } else {
          msg = message;
        }
        throw new Error(msg);
      }
    },
    async getOverview({ commit, state }) {
      try {
        const data = await fetchOverview(state.topic, state.address);
        //  overview.value = data;
        commit("SET_OVERVIEW", data);
        // store.dispatch('')
      } catch (error) {
        console.log(error);
      }
    },
    async switchNetwork(context, chainId: number) {
      try {
        const id = "0x" + Number(chainId).toString(16);
        console.log(id);
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: id }],
        });
      } catch (error: any) {
        console.log(error);
        if (error.code == 4902 || error.data?.originalError.code == 4902) {
          console.log("switch error 2", error);
          await store.dispatch("addChain", chainId);
        } else {
          throw error;
        }
      }
    },
    async addChain(context, chainId: number) {
      try {
        const param = (chainInfo as any)[chainId];
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [param],
        });
      } catch (error) {
        console.log("add chain err", error);
      }
    },
  },

  // modules: {
  //   sdkStore,
  // },
});

// export const useStore: () => Store<IRootStateWithModule> = () => {
//   return useVuexStore();
// };

export function useStore(): Store<IStoreType> {
  return useVuexStore();
}
export default store;
