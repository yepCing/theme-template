import {
  AuthClient,
  BucketClient,
  PinningClient,
  verifySignResult,
} from "@4everland/upload-pin";

interface ISdkAuthInfo extends verifySignResult {
  address: string;
}
interface ISdkRootState {
  authClient: AuthClient;
  sdkAuthInfo: ISdkAuthInfo;
  bucketClient: BucketClient | null;
  pinningClient: PinningClient | null;
}

export { ISdkRootState, ISdkAuthInfo };
