const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: ["@smithy"],
  publicPath: "./",
  // devServer: {
  //   proxy: {
  //     "^/api": {
  //       target: "https://temp-template.foreverland.xyz",
  //       pathRewrite: {
  //         "^/api": "",
  //       },
  //       changeOrigin: true,
  //     },
  //   },
  // },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    resolve: {
      fallback: {
        fs: false,
      },
    },
  },
});
