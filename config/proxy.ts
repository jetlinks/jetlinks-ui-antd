/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/jetlinks': {
      // target: 'http://192.168.32.44:8844/',
      // ws: 'ws://192.168.32.44:8844/',
      target: 'http://120.79.18.123:8844/',
      ws: 'ws://120.79.18.123:8844/',
      // target: 'http://192.168.66.5:8844/',
      // ws: 'ws://192.168.66.5:8844/',
      // ws: 'ws://demo.jetlinks.cn/jetlinks',
      // target: 'http://demo.jetlinks.cn/jetlinks',
      changeOrigin: true,
      pathRewrite: { '^/jetlinks': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
