import "@vue/runtime-core";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $message: any;
    $loading: any;
  }
}
