import { GREEN_CHAIN_ID, GRPC_URL } from "./env";
import { Client } from "@bnb-chain/greenfield-js-sdk";
import { ObjectMeta } from "@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common";
import { getOffchainAuthKeys } from "./utils";
import { ReedSolomon } from "@bnb-chain/reed-solomon";
export const client = Client.create(
  GRPC_URL as string,
  GREEN_CHAIN_ID.toString(),
  {
    zkCryptoUrl:
      "https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.3/dist/node/zk-crypto.wasm",
  }
);
export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter(
    (v) => v.endpoint == "https://gnfd-sp.4everland.org"
  );
  return finalSps;
};

export const getAllSps = async () => {
  const sps = await getSps();
  return sps.map((sp) => {
    return {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
      name: sp.description?.moniker,
    };
  });
};

export const selectSp = async () => {
  const finalSps = await getSps();
  const selectIndex = Math.floor(Math.random() * finalSps.length);
  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    id: finalSps[selectIndex].id,
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };

  return selectSpInfo;
};

export const listObject = async (bucketName: string) => {
  try {
    const spInfo = await selectSp();
    const { body } = await client.object.listObjects({
      bucketName,
      endpoint: spInfo.endpoint,
    });
    let objects: ObjectMeta[] = [];
    if (body) {
      objects = body.GfSpListObjectsByBucketNameResponse.Objects;
    }
    console.log(objects);
  } catch (error) {
    console.log(error);
  }
};

export const createTx = async (
  file: File,
  bucketName: string,
  address: string
  // connector: any
) => {
  if (!address || !file) return;
  // const provider = await connector?.getProvider();
  const offChainData = await getOffchainAuthKeys(address, window.ethereum);
  if (!offChainData) {
    alert("No offchain, please create offchain pairs first");
    return;
  }
  const rs = new ReedSolomon();
  const fileBytes = await file.arrayBuffer();
  const expectCheckSums = rs.encode(new Uint8Array(fileBytes));
  const createObjectTx = await client.object.createObject(
    {
      bucketName: bucketName,
      objectName: file.name,
      creator: address,
      visibility: "VISIBILITY_TYPE_PUBLIC_READ",
      fileType: file.type,
      redundancyType: "REDUNDANCY_EC_TYPE",
      contentLength: fileBytes.byteLength,
      expectCheckSums: expectCheckSums,
    },
    {
      type: "EDDSA",
      domain: window.location.origin,
      seed: offChainData.seedString,
      address,
    }
  );

  const simulateInfo = await createObjectTx.simulate({
    denom: "BNB",
  });

  console.log("simulateInfo", simulateInfo);

  const res = await createObjectTx.broadcast({
    denom: "BNB",
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || "5000000000",
    payer: address,
    granter: "",
  });
  if (res.code === 0) {
    console.log("create object success");
    return res.transactionHash;
  }
};

export const uploadObject = async (
  file: File,
  bucketName: string,
  address: string
) => {
  const txnHash = await createTx(file, bucketName, address);

  console.log(txnHash, "createTx");
  if (!txnHash) return;
  // const provider = await connector?.getProvider();
  const offChainData = await getOffchainAuthKeys(address, window.ethereum);

  const spInfo = await selectSp();
  console.log("spInfo", spInfo.endpoint);
  if (!offChainData) {
    alert("No offchain, please create offchain pairs first");
    return;
  }
  const objectName = file.name;
  const uploadRes = await client.object.uploadObject(
    {
      bucketName: bucketName,
      objectName: file.name,
      body: file,
      txnHash,
    },
    {
      type: "EDDSA",
      domain: window.location.origin,
      seed: offChainData.seedString,
      address,
    }
  );
  console.log(uploadRes, "upload success obj");
  if (uploadRes.code === 0) {
    // alert("success");
    return {
      txnHash: "0x" + txnHash.toLocaleLowerCase(),
      link: spInfo.endpoint + "/view/" + bucketName + "/" + objectName,
    };
  }
};

// export const createBucket = async (
//   address: string,
//   bucketName: string,
//   connector: any
// ) => {
//   if (!address) return;
//   const spInfo = await selectSp();
//   const provider = await connector?.getProvider();
//   const offChainData = await getOffchainAuthKeys(address, provider);
//   if (!offChainData) {
//     alert("No offchain, please create offchain pairs first");
//     return;
//   }

//   try {
//     const createBucketTx = await client.bucket.createBucket(
//       {
//         bucketName: bucketName,
//         creator: address,
//         visibility: "VISIBILITY_TYPE_PUBLIC_READ",
//         chargedReadQuota: "0",
//         spInfo: {
//           primarySpAddress: spInfo.primarySpAddress,
//         },
//         paymentAddress: address,
//       },
//       {
//         type: "EDDSA",
//         domain: window.location.origin,
//         seed: offChainData.seedString,
//         address,
//       }
//     );

//     const simulateInfo = await createBucketTx.simulate({
//       denom: "BNB",
//     });

//     console.log("simulateInfo", simulateInfo);

//     const res = await createBucketTx.broadcast({
//       denom: "BNB",
//       gasLimit: Number(simulateInfo?.gasLimit),
//       gasPrice: simulateInfo?.gasPrice || "5000000000",
//       payer: address,
//       granter: "",
//     });

//     if (res.code === 0) {
//       alert("success");
//     }
//   } catch (err) {
//     console.log(typeof err);
//     if (err instanceof Error) {
//       alert(err.message);
//     }
//     if (err && typeof err === "object") {
//       alert(JSON.stringify(err));
//     }
//   }
// };
