import Request from "..";
import { IItemInfo, PostRecord } from "./type";
const mainRequest = new Request({
  baseURL: process.env.VUE_APP_BASE_URL,
});

export const fetchHomeList = (
  topic: string,
  page: number,
  sortType: string
) => {
  return mainRequest.get<IItemInfo[]>({
    url: `/${topic}/posts/page/${page}?sort=${sortType}`,
  });
};

export const handleThumbup = (topic: string, id: string, code: string) => {
  return mainRequest.post<void>({
    url: `/${topic}/posts/${id}/thumbup?code=${code}`,
  });
};

export const handleSticky = (topic: string, id: string, code: string) => {
  return mainRequest.put<void>({
    url: `/${topic}/posts/${id}/stick?code=${code}`,
  });
};

export const handleUnSticky = (topic: string, id: string, code: string) => {
  return mainRequest.put<void>({
    url: `/${topic}/posts/${id}/unstick?code=${code}`,
  });
};

export const handleDeleteItem = (topic: string, id: string, code: string) => {
  return mainRequest.delete<void>({
    url: `/${topic}/posts/${id}?code=${code}`,
  });
};

export const fetchDetailInfo = (topic: string, id: string) => {
  return mainRequest.get<IItemInfo>({
    url: `/${topic}/posts/${id}`,
  });
};

export const handlePostRecord = (
  topic: string,
  code: string,
  data: PostRecord
) => {
  return mainRequest.post<void>({
    url: `/${topic}/posts?code=${code}`,
    data,
  });
};
