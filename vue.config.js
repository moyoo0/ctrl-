module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
        'plugins': '@/plugins',

      },
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify")
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
         target: 'http://localhost:8001',
        //target: 'http://10.122.209.217:8001',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/apl': {
        target: 'http://localhost:9999',
        //target: 'http://10.21.151.253:8001',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/apl': ''
        }
      },
      '/downloadfile': {
        target: 'https://chen110.oss-cn-guangzhou.aliyuncs.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/downloadfile': ''
        }
      },
      '/downloadvideo': {
        target: 'https://outin-cefd5d83abc511ebb0a800163e1a625e.oss-cn-shanghai.aliyuncs.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/downloadvideo': ''
        }
      },

    }
  },
  // 使用 publicPath 替代 baseUrl
  publicPath: '/',
  // 将 lintOnSave 设置为 false 或者 'warning'
  lintOnSave: false
}
