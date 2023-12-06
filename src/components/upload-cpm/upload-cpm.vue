<template>
  <div>
    <!-- pc upload component -->
    <el-dialog v-model="showUpload" :show-close="false" class="upload-dialog">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header pt-5">
          <h4 :id="titleId" :class="titleClass" class="ta-c my-0">
            Upload Theme Content
          </h4>
          <div @click="close" class="close-btn al-c f-center cursor-p">
            <img src="@/assets/img/icon/close.svg" width="20" alt="" />
          </div>
        </div>
      </template>

      <div
        class="d-flex f-center pa-6"
        style="height: 100%; box-sizing: border-box"
      >
        <div class="upload-content pa-6">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :on-change="onChange"
            ref="uploadRef"
            drag
            action="#"
            accept="image/*, video/*"
            :show-file-list="false"
          >
            <div style="width: 100%" v-if="file">
              <img
                v-if="/image/.test(file.type)"
                style="width: 100%"
                :src="priviewUrl"
                alt=""
              />
              <video
                v-else
                style="width: 100%"
                controls
                :src="priviewUrl"
              ></video>
            </div>
            <div v-else class="no-upload h-flex f-center al-c">
              <img src="@/assets/img/icon/upload.svg" width="36" alt="" />
              <h3 class="mt-5">Drag and drop video/image files to upload</h3>

              <div class="al-c h-flex upload-limit">
                <p>10 MB max file size for image (JPG)</p>
                <p>50 MB max file size for video (MP4)</p>
              </div>
            </div>
          </el-upload>
        </div>
        <div class="upload-form pl-6 h-flex space-btw">
          <div>
            <div>
              <input
                type="text"
                placeholder="Add a title"
                class="upload-ipt"
                v-model="title"
              />
              <div class="mt-1 al-c space-btw fz-12" style="height: 16px">
                <span></span>
                <span
                  class="ipt-num"
                  v-show="title.length != 0"
                  :class="{ overflow: title.length > 30 }"
                >
                  {{ 30 - title.length }}
                </span>
              </div>
            </div>
            <!-- <div>
              <input
                type="text"
                placeholder="Tell viewers about your image or video"
                class="upload-ipt desc-ipt mt-4"
                v-model="desc"
              />
              <div class="mt-1 al-c space-btw fz-12" style="height: 16px">
                <span></span>
                <span
                  class="ipt-num"
                  v-show="desc.length != 0"
                  :class="{ overflow: desc.length > 300 }"
                >
                  {{ 300 - desc.length }}
                </span>
              </div>
            </div> -->

            <div>
              <div
                class="div-text"
                contenteditable="true"
                v-text="desc"
                @input="onDiv"
              ></div>
              <div class="mt-1 al-c space-btw fz-12" style="height: 16px">
                <span></span>
                <span
                  class="ipt-num"
                  v-show="desc.length != 0"
                  :class="{ overflow: desc.length > 300 }"
                >
                  {{ 300 - desc.length }}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div v-if="uploadStatus != 0">
              <div class="al-c space-btw mb-3">
                <span>Progress</span>
                <span>{{ percentage.toFixed(2) }}%</span>
              </div>
              <el-progress :percentage="percentage" :color="percentageColor">
              </el-progress>
              <div class="upload-tips fz-12 mt-1" v-html="uploadText"></div>
            </div>
            <div
              class="confrim-btn py-4 mt-6 fz-18 fw-b al-c f-center"
              :class="{ loading: uploadLoading || uploadDisabled }"
              @click="handleConfirm"
            >
              <span class="loader-1" v-if="uploadLoading"></span>
              <span v-else> Upload</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- mobile upload component -->
    <el-drawer v-model="drawer" direction="btt" size="75%" :with-header="false">
      <div class="h-flex space-btw" style="height: 100%">
        <div class="m-upload-control">
          <div
            class="m-upload-content al-c f-center"
            @click="uploadIpt.click()"
          >
            <div v-if="file" class="img-preview">
              <img
                v-if="/image/.test(file.type)"
                style="width: 100%"
                :src="priviewUrl"
                alt=""
              />
              <video
                height="140"
                v-else
                controls
                style="width: 100%"
                :poster="priviewUrl"
                :src="priviewUrl"
              ></video>
            </div>
            <img v-else src="@/assets/img/icon/upload.svg" width="36" alt="" />

            <input
              type="file"
              style="display: none"
              @input="onInputChange"
              ref="uploadIpt"
              accept="image/*, video/*"
            />
          </div>
        </div>

        <div class="m-upload-form h-flex space-btw mt-4 flex-1">
          <div>
            <div>
              <input
                type="text"
                placeholder="Add a title"
                class="upload-ipt"
                v-model="title"
              />
              <div class="mt-1 al-c space-btw fz-12" style="height: 16px">
                <span></span>
                <span
                  class="ipt-num"
                  v-show="title.length != 0"
                  :class="{ overflow: title.length > 30 }"
                >
                  {{ 30 - title.length }}
                </span>
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Tell viewers about your image or video"
                class="upload-ipt desc-ipt mt-4"
                v-model="desc"
              />
              <div class="mt-1 al-c space-btw fz-12" style="height: 16px">
                <span></span>
                <span
                  class="ipt-num"
                  v-show="desc.length != 0"
                  :class="{ overflow: desc.length > 300 }"
                >
                  {{ 300 - desc.length }}
                </span>
              </div>
            </div>

            <!-- <div>
              <div
                class="div-text"
                contenteditable
                v-text="desc"
                @input="onDiv"
              ></div>
              <div class="mt-1 al-c space-btw fz-12" style="height: 16px">
                <span></span>
                <span
                  class="ipt-num"
                  v-show="desc.length != 0"
                  :class="{ overflow: desc.length > 300 }"
                >
                  {{ 300 - desc.length }}
                </span>
              </div>
            </div> -->
          </div>
          <div class="mt-5">
            <div v-if="uploadStatus != 0">
              <div class="al-c space-btw mb-3 fz-12">
                <span>Progress</span>
                <span>{{ percentage.toFixed(2) }}%</span>
              </div>
              <el-progress :percentage="percentage" :color="percentageColor">
              </el-progress>
              <div class="upload-tips fz-12 mt-1" v-html="uploadText"></div>
            </div>
            <div
              class="confrim-btn py-4 mt-6 fz-18 fw-b al-c f-center"
              :class="{ loading: uploadLoading || uploadDisabled }"
              @click="handleConfirm"
            >
              <span class="loader-1" v-if="uploadLoading"></span>
              <span v-else> Upload</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- upload success dialog -->
    <el-dialog
      v-model="showSuccess"
      class="upload-success"
      align-center
      :show-close="false"
    >
      <template #header>
        <div class="upload-success-header">
          <img src="@/assets/img/imgs/upload-success.png" width="413" alt="" />
          <div class="fw-b fz-20 header ta-c">Upload Successful!!</div>
        </div>
      </template>
      <div class="my-10 ta-c content fw-b fz-16">
        <span>Congratulations! </span><span>Points </span
        ><span style="color: #9747ff">+1</span>
      </div>
      <div class="btn cursor-p fz-20 ta-c py-3" @click="showSuccess = false">
        OK
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  getCurrentInstance,
  watch,
  ComponentInternalInstance,
} from "vue";
import emitBus from "@/utils/mitt";
import { useStore } from "@/store";
import { handlePostRecord } from "@/request/main/main";
import type { UploadFile, UploadRawFile, UploadInstance } from "element-plus";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const store = useStore();

emitBus.off("handleUpload");
emitBus.on("handleUpload", (isMobile) => {
  if (isMobile) {
    drawer.value = true;
  } else {
    showUpload.value = true;
  }
});
const showUpload = ref(false);
const drawer = ref(false);
const showSuccess = ref(false);
const sdkAuthInfo = computed(() => {
  return store.state.sdkStore.sdkAuthInfo;
});

const uploadDisabled = computed(() => {
  return (
    title.value.length > 30 ||
    title.value.length == 0 ||
    desc.value.length > 300 ||
    desc.value.length == 0 ||
    !file.value
  );
});
let uploadRef = ref<UploadInstance>();
let file = ref<File | null>();
let priviewUrl = ref("");
let title = ref("");
let desc = ref("");
let percentage = ref(0);
const uploadIpt = ref(null);
let uploadLoading = ref(false);
// 0 not upload 1 uploading 2 uploaded 3 upload failed
let uploadStatus = ref(0);
let uploadText = ref(
  "Please stay on the page during the upload process to prevent any upload errors."
);
const percentageColor = computed(() => {
  if (uploadStatus.value == 3) {
    return "#F35950";
  }
  return "#00EF99";
});
const bucketClient = computed(() => {
  return store.state.sdkStore.bucketClient;
});
const pinningClient = computed(() => {
  return store.state.sdkStore.pinningClient;
});

const handleConfirm = async () => {
  if (uploadDisabled.value) return;
  if (uploadLoading.value) return;
  uploadLoading.value = true;
  try {
    uploadStatus.value = 1;
    uploadText.value =
      "Please stay on the page during the upload process to prevent any upload errors.";
    await store.dispatch("getSts");

    percentage.value = 0;

    const task = bucketClient.value!.uploadObject({
      Bucket: sdkAuthInfo.value.accessBucket,
      Key: sdkAuthInfo.value.folderPath + "/" + file.value!.name,
      Body: file.value as File,
      ContentType: file.value!.type,
    });

    task.progress((e: any) => {
      percentage.value = (e.loaded! / e.total!) * 100;
    });
    const { cid } = await task.done();
    const pininfo = await pinningClient.value!.addPin({
      cid,
    });
    console.log(pininfo);
    uploadStatus.value = 2;
    const code = await store.dispatch("getCode", { scope: "upload" });

    await handlePostRecord(store.state.topic, code, {
      title: title.value,
      description: desc.value,
      type: /image/.test(file.value!.type) ? "image" : "video",
      cid,
    });
    // Update User Info
    await store.dispatch("getUserInfo");
    await store.dispatch("getProjectInfo");
    showUpload.value = false;
    drawer.value = false;
    showSuccess.value = true;
    emitBus.emit("getList", true);
  } catch (error: any) {
    console.log(error, "upload error");
    uploadStatus.value = 3;
    if (/Bucket quota exceeded/.test(error.message)) {
      uploadText.value = `Upload failed due to insufficient resources. Visit <span style="color: #9747FF; cursor: pointer" onclick="window.open('https://dashboard.4everland.org/overview')">4EVERLAND</span> for additional resources.`;
    } else if (/user rejected action/.test(error.message)) {
      uploadText.value = `User rejected action`;
    } else {
      uploadText.value = `Upload failed`;
    }
  }
  uploadLoading.value = false;
};
const onChange = (obj: UploadFile) => {
  let raw = obj.raw as UploadRawFile;
  let size = raw.size / 1024 / 1024;
  if (/image\//.test(raw.type)) {
    if (size > 10) {
      file.value = null;
      return proxy!.$message("img over size");
    }
  } else {
    if (size > 50) {
      file.value = null;
      return proxy!.$message("video over size");
    }
  }
  file.value = obj.raw;
};
const onInputChange = (e: Event) => {
  const value = e.target as HTMLInputElement;
  if (!value.files) return;
  let size = value.files[0].size / 1024 / 1024;
  if (/image/.test(value.files[0].type)) {
    if (size > 10) {
      file.value = null;
      return proxy!.$message("img over size");
    }
  } else {
    if (size > 50) {
      file.value = null;
      return proxy!.$message("video over size");
    }
  }
  file.value = value.files[0];
};
const onDiv = (e: Event) => {
  desc.value = (e.target as HTMLElement).innerText;
};
watch(showUpload, (val) => {
  if (!val) {
    title.value = "";
    desc.value = "";
    uploadRef.value!.clearFiles();
    file.value = null;
    percentage.value = 0;
    uploadStatus.value = 0;
  }
});

watch(drawer, (val) => {
  if (!val) {
    title.value = "";
    desc.value = "";
    file.value = null;
    percentage.value = 0;
    uploadStatus.value = 0;
  }
});

watch(file, (newVal) => {
  if (priviewUrl.value) {
    window.URL.revokeObjectURL(priviewUrl.value);
  }
  if (newVal) {
    priviewUrl.value = window.URL.createObjectURL(newVal);
  }
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  :deep .upload-success {
    width: 90% !important;
    padding: 40px 20px !important;
    border-radius: 12px !important;
  }
}
:deep .el-drawer {
  border-radius: 12px 12px 0 0;
}
:deep .el-upload-dragger {
  height: 100% !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  border: 1px dashed #79788f !important;
  background: #f8f8fa !important;
}
.close-btn {
  position: absolute;
  right: 24px;
  top: 15px;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(140, 140, 161, 0.25);
  border-radius: 50%;
}

:deep .upload-dialog {
  width: 80% !important;
  height: 70% !important;
  border-radius: 12px !important;
  .el-dialog__body {
    height: calc(100% - 44px);
    box-sizing: border-box;
  }
}
:deep .el-progress__text {
  display: none !important;
}
.upload-content {
  flex: 1;
  background: rgba(140, 140, 161, 0.05);
  border-radius: 24px;
  .upload-demo {
    height: 100%;
    :deep .el-upload {
      height: 100%;
    }
  }
  .no-upload {
    position: relative;
    height: 100%;
    .upload-limit {
      position: absolute;
      width: 100%;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      > p {
        margin: 0;
        color: #8c8ca1;
        font-size: 12px;
      }
    }
  }
}
.div-text {
  max-height: 200px;
  padding: 10px 0 10px 12px;
  color: #000;
  outline: none;
  font-size: 14px;
  border-bottom: 1px solid rgba(140, 140, 161, 0.25);
  overflow: auto;
}
.div-text:empty::after {
  display: block;
  content: "Tell viewers about your image or video";
  color: #dcdce3;
  font-size: 14px;
}
.upload-form {
  width: 50%;
  box-sizing: border-box;
  .upload-ipt {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 12px;
    border: none;
    outline: 0;
    border-bottom: 1px solid rgba(140, 140, 161, 0.25);
    color: #000;
    font-size: 24px;
  }

  .upload-ipt::placeholder {
    color: rgba(140, 140, 161, 0.25);
  }
  .upload-ipt:focus {
    // border-bottom: 1px solid red;
  }
  .desc-ipt {
    font-size: 14px;
  }
  .upload-tips {
    color: rgba(140, 140, 161, 0.5);
  }
  .ipt-num {
    color: #8c8ca1;
  }
  .ipt-num.overflow {
    color: #f35950;
  }
  .confrim-btn {
    background: #9747ff;
    border-radius: 12px;
    color: #fff;
    cursor: pointer;
  }
  .confrim-btn.loading {
    background: #ccc;
  }
}
:deep .el-dialog__header {
  margin-right: 0;
  padding: 0;
}
:deep .upload-success {
  width: 528px;
  padding: 40px 88px;
  border-radius: 12px;
  box-sizing: border-box;
  .upload-success-header {
    position: relative;
    > img {
      position: absolute;
      left: 50%;
      top: -140px;
      transform: translateX(-50%);
    }
    .header {
      color: #9747ff;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
  .content {
    color: #0e0e2c;
  }
  .btn {
    border-radius: 12px;
    background: #9747ff;
    color: #fff;
  }
}

.m-upload-control {
  padding: 7px;
  width: 160px;
  height: 160px;
  border-radius: 8px;
  background: rgba(140, 140, 161, 0.05);
  box-sizing: border-box;
  .m-upload-content {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 1px dashed #8c8ca1;
    .img-preview {
      width: 100%;
      height: 100%;
      > img,
      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}

.m-upload-form {
  width: 100%;
  box-sizing: border-box;
  .upload-ipt {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 12px;
    border: none;
    outline: 0;
    border-bottom: 1px solid rgba(140, 140, 161, 0.25);
    color: #000;
    font-size: 18px;
  }
  .upload-ipt::placeholder {
    color: rgba(140, 140, 161, 0.25);
  }
  .upload-ipt:focus {
    // border-bottom: 1px solid red;
  }
  .desc-ipt {
    font-size: 14px;
  }
  .upload-tips {
    color: rgba(140, 140, 161, 0.5);
  }
  .ipt-num {
    color: #8c8ca1;
  }
  .ipt-num.overflow {
    color: #f35950;
  }
  .confrim-btn {
    background: #9747ff;
    border-radius: 12px;
    color: #fff;
    cursor: pointer;
  }
  .confrim-btn.loading {
    background: #ccc;
  }
}
.loader-1 {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #fff;
  border-left-color: transparent;
  animation: animate_681 1s linear infinite;
  position: relative;
}

@keyframes animate_681 {
  0% {
    transform: rotate(-360deg);
  }
}
</style>
