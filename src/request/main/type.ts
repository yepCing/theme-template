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

export interface PostRecord {
  title: string;
  description: string;
  type: "image" | "video";
  cid: string;
}
