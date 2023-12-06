import { Module } from "vuex";
import { ISdkRootState, ISdkAuthInfo } from "./type";

import { AuthClient, BucketClient, PinningClient } from "@4everland/upload-pin";
import { ethers } from "ethers";

const store: Module<ISdkRootState, any> = {
  state: {
    authClient: new AuthClient(process.env.VUE_APP_AUTH_URL!),
    sdkAuthInfo: JSON.parse(localStorage.getItem("sdk-info") ?? "{}"),
    bucketClient: null,
    pinningClient: null,
  },
  mutations: {
    SET_SDK_AUTH_INFO(state, info: ISdkAuthInfo) {
      state.sdkAuthInfo = info;
    },
    INIT_CLIENT(state) {
      const { accessKeyId, secretAccessKey, sessionToken, token } =
        state.sdkAuthInfo;
      const bucketClient = new BucketClient({
        accessKeyId,
        secretAccessKey,
        sessionToken,
        endpoint: process.env.VUE_APP_ENDPOINT_URL!,
      });
      state.bucketClient = bucketClient;
      const pinningClient = new PinningClient({
        baseURL: process.env.VUE_APP_PIN_URL!,
        accessToken: token,
      });
      state.pinningClient = pinningClient;
    },
  },
  actions: {
    // Get SDK Auth Info , Includes STS
    async getSts({ state, commit }) {
      try {
        if (!window.ethereum) return window.open("https://metamask.io/");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        if (
          state.sdkAuthInfo &&
          state.sdkAuthInfo.expiration >= +new Date() / 1000 &&
          state.sdkAuthInfo.address == localStorage.address
        ) {
          if (!state.bucketClient || !state.pinningClient) {
            commit("INIT_CLIENT");
          }
          return;
        }
        const text = await state.authClient.getSignText(signer.address);
        const signature = await signer.signMessage(text);
        const verifyResult = await state.authClient.verifySign(
          signer.address,
          signature
        );

        const sdkAuthInfo = {
          ...verifyResult,
          address: signer.address.toLocaleLowerCase(),
        };
        commit("SET_SDK_AUTH_INFO", sdkAuthInfo);
        commit("INIT_CLIENT");
        localStorage.setItem("sdk-info", JSON.stringify(sdkAuthInfo));
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

export default store;
