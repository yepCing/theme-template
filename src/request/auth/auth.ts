import Request from "..";
import { IProjectInfo, IAccount, IAuth } from "./type";

const authRequest = new Request({
  baseURL: process.env.VUE_APP_BASE_URL,
});

export const fetchProjectInfo = (topic: string) => {
  return authRequest.get<IProjectInfo>({
    url: `/${topic}/info`,
  });
};

export const fetchUserInfo = (topic: string) => {
  return authRequest.get<IAccount>({
    url: `/${topic}/account`,
  });
};

export const fetchSignature = (
  topic: string,
  address: string,
  scope: string
) => {
  return authRequest.get<any>({
    url: `/${topic}/account/${address}/auth?scope=${scope}`,
  });
};
export const verifySignature = (
  topic: string,
  address: string,
  signature: string
) => {
  return authRequest.post<IAuth>({
    url: `/${topic}/account/${address}/auth`,
    data: {
      signature,
    },
  });
};
