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

export interface Overview {
  hiveName: string;
  holds: string;
  journal: string;
  pool: string;
  price: string;
  total: string;
  owner: string;
}
