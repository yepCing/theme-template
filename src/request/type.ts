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
  hash: string;
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
