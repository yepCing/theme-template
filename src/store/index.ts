import { createStore, Store, useStore as useVuexStore } from "vuex";
import { IRootState, IStoreType } from "./type";
import axios from "axios";
// import { request } from "@/request";
import {
  fetchProjectInfo,
  fetchSignature,
  fetchUserInfo,
  verifySignature,
} from "@/request/auth/auth";
import { ethers } from "ethers";
import sdkStore from "./upload-client/index";

import { IConfigItem, IConfigJson, IConfigObjs } from "@/request/type";
const store = createStore<IRootState>({
  state: {
    address: localStorage.address || null,
    token: localStorage.token || null,
    userInfo: { posts: 0, ratio: 0, uid: "" },
    projectInfo: null,
    configObj: null,
    topic: "",
    s3: null,
    gateway: localStorage.gateway,
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
    SET_CONFIGOBJ(state, info) {
      state.configObj = info;
    },
    SET_PROJECTINFO(state, info) {
      state.projectInfo = info;
    },
    SET_TOPIC(state, topic) {
      state.topic = topic;
    },
    SET_S3(state, s3) {
      state.s3 = s3;
    },
    SET_GATEWAY(state, gateway) {
      state.gateway = gateway;
    },
  },
  actions: {
    async initProject({ commit, dispatch, state }) {
      try {
        const { data }: { data: IConfigJson } = await axios.get(
          "./config.json"
        );
        const theme = data.config.find(
          (it: IConfigItem) => it.name == "Theme Name"
        );
        const topic = theme?.options[0].value;
        const configObj: IConfigObjs = {
          background: "",
          bio: "",
          ipfsGateway: "",
          themeName: "",
          discord: "",
          telegram: "",
          twitter: "",
          imgCIDTable: [],
        };
        data.config.forEach((item: IConfigItem) => {
          item.options.forEach((i) => {
            if (i.key == "imgCIDTable") {
              configObj.imgCIDTable = i.items;
            } else {
              configObj[i.key] = i.value;
            }
          });
        });
        if (topic) {
          document.title = topic;
        }
        commit("SET_CONFIGOBJ", configObj ?? {});
        if (!state.gateway) {
          let gateway = (configObj.ipfsGateway as string).trim();
          if (!gateway) {
            gateway = "https://ipfs.4everland.io/ipfs/";
          } else {
            const i = gateway.lastIndexOf("/");
            if (i == gateway.length - 1) {
              gateway = gateway + "ipfs/";
            } else {
              gateway = gateway + "/ipfs/";
            }
          }
          localStorage.gateway = gateway;
          commit("SET_GATEWAY", gateway);
        }
        commit("SET_TOPIC", topic);
        await dispatch("getProjectInfo");
        await dispatch("getUserInfo");
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
    async getUserInfo({ commit, state }) {
      try {
        let userInfo = { posts: 0, ratio: 0, uid: "" };
        if (state.token) {
          const data = await fetchUserInfo(state.topic);
          if (data) {
            userInfo = data;
          }
          localStorage.userInfo = JSON.stringify(userInfo);
        }
        commit("SET_INFO", userInfo);
      } catch (error: any) {
        console.log(error);
        console.log(error.message);
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

        const addr = signer.address.toLocaleLowerCase();
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
          address: signer.address.toLocaleLowerCase(),
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
  },

  modules: {
    sdkStore,
  },
});

// export const useStore: () => Store<IRootStateWithModule> = () => {
//   return useVuexStore();
// };

export function useStore(): Store<IStoreType> {
  return useVuexStore();
}
export default store;
