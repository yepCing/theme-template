import { IProjectInfo } from "@/request/type";
import { ISdkRootState } from "./upload-client/type";
import { Overview } from "@/request/auth/type";
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
  overview: Overview;
}

interface IRootStateWithModule {
  sdkStore: ISdkRootState;
}

type IStoreType = IRootState & IRootStateWithModule;
export { IRootState, IStoreType };
