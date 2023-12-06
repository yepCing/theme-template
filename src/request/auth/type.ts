export interface IProjectInfo {
  owner: string;
  participators: number;
  posts: number;
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
