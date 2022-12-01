module.exports = (config) => {
  return {
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 20000, // 允许新拆出 chunk 的最小体积，也是异步 chunk 公共模块的强制拆分体积
        maxSize: 307200,
        maxAsyncRequests: 6, // 每个异步加载模块最多能被拆分的数量
        maxInitialRequests: 6, // 每个入口和它的同步依赖最多能被拆分的数量
        enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值并忽略其他限制
        cacheGroups: {
          vendors: {
            name: `chunk-vendors`,
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: "all",
          },
          element: {
            chunks: "all",
            name: `element-ui`,
            test: /[\\/]element-ui[\\/]/,
            priority: 0,
          },
          three: {
            chunks: "all",
            name: `three`,
            test: /[\\/]three[\\/]/,
            priority: 0,
          },
          "vis-three": {
            chunks: "all",
            name: `vis-three`,
            test: /[\\/]vis-three[\\/]/,
            priority: 0,
          },
          vue: {
            chunks: "all",
            name: `vue`,
            test: /[\\/]vue[\\/]/,
            priority: 0,
          },
          nprogress: {
            chunks: "all",
            name: `nprogress`,
            test: /[\\/]nprogress[\\/]/,
            priority: 0,
          },
        },
      },
    },
  };
};
