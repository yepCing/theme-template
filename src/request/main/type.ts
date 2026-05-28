export interface PostRecord {
  title: string;
  description: string;
  type: "image" | "video";
  cid: string;
  hash: string;
}

export interface Holder {
  address: string;
  holds: number;
}

export interface Trade {
  block: number;
  creator: string;
  ethAmount: string;
  id: number;
  isBuy: boolean;
  protocolEthAmount: string;
  shareAmount: number;
  subject: string;
  subjectEthAmount: string;
  supply: string;
  trader: string;
  txn: string;
}
