import { IProjectInfo } from "@/request/type";
import { ISdkRootState } from "./upload-client/type";
interface IUserInfo {
  posts: number;
  ratio: number;
  uid: string;
}

interface IRootState {
  userInfo: IUserInfo;
  address: any;
  token: string;
  projectInfo: IProjectInfo | null;
  configObj: any;
  topic: string;
  s3: any;
  gateway: string;
}

interface IRootStateWithModule {
  sdkStore: ISdkRootState;
}

type IStoreType = IRootState & IRootStateWithModule;
export { IRootState, IStoreType };
