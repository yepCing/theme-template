enum Key {
  background = "background",
  bio = "bio",
  ipfsGateway = "ipfsGateway",
  themeName = "themeName",
  discord = "discord",
  telegram = "telegram",
  twitter = "twitter",
  imgCIDTable = "imgCIDTable",
}

export interface IConfigItem {
  name: string;
  options: {
    type: string;
    key: string;
    value: string;
    placeholder?: string;
    headers?: {
      text: string;
      value: string;
    }[];
    items: {
      CID: string;
    }[];
  }[];
  tag: string;
}
export interface IConfigJson {
  config: IConfigItem[];
}

export interface IConfigObj {
  background: string;
  bio: string;
  ipfsGateway: string;
  themeName: string;
  discord: string;
  telegram: string;
  twitter: string;
  imgCIDTable: {
    CID: string;
  }[];
}

type c = {
  [key in string]:
    | string
    | {
        CID: string;
      }[];
};
export type IConfigObjs = IConfigObj & c;

export interface IProjectInfo {
  owner: string;
  participators: number;
  posts: number;
}

export interface IItemInfo {
  avatar: string;
  cid: string;
  content: string;
  creator: string;
  id: number;
  sticked: boolean;
  thumbed: boolean;
  thumbs: number;
  title: string;
  type: string;
}

export interface IAccount {
  posts: number;
  ratio: number;
  uid: string;
}

export interface IAuth {
  code: string;
  token: string;
  expiredAt: number;
}
