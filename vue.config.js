module.exports = {
  // app部署路径
  publicPath: "/",
  // build目录
  outputDir: "dist",
  indexPath: 'uyReportSearch.html',
  productionSourceMap: false,
  // pages: {
  //   financialForecasts: {
  //     entry: './src/main.js',
  //     template: './src/views/financial/financialForecasts.vue',
  //     fileName: 'financialForecasts.html'
  //   },
  //   separateEstimates: {
  //     entry: './src/main.js',
  //     template: './src/views/financial/separateEstimates.vue'
  //   },
  //   actuarialEstimates: {
  //     entry: './src/main.js',
  //     template: './src/views/actuarial/actuarialEstimates.vue'
  //   }
  // },
  devServer: {
    // clientLogLevel: 'warning',
    // historyApiFallback: true,
    // hot: true,
    // compress: true,
    // host: '0.0.0.0',
    port: 3000,
    // open: false,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    // watchOptions: {
    //   poll: false
    // },
    proxy: {
      // 人员和组织接口, 针对/api/v2/user/search和/api/v2/organization/search，这2个接口没用到的可以不配
      "/api/": {
        target: "http://upmsapi.sit.com:10020",
        changeOrigin: true,
        secure: false,
      },
      // 统一网关接口
      "/SolomonService/": {
        target: "http://upmsapi.sit.com:10020",
        changeOrigin: true,
      },
    //   "/estimate": {
    //     target: "http://yapi.smart-xwork.cn/mock/134845",
    //     changeOrigin: true,
    //   },
      "/estimate": {
        target: "http://10.10.128.14:8106",
        changeOrigin: true,
      },
    },
  },
};
