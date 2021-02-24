/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/jetlinks': {
      // target: 'http://192.168.3.183:8844/',
      // ws: 'ws://192.168.3.183:8844/',
      target: 'http://192.168.22.222:8840/',
      ws: 'ws:://192.168.22.222:8840/',
      changeOrigin: true,
      pathRewrite: {'^/jetlinks': ''},
    },
  },
  test: {
    '/jetlinks': {
      // target: 'http://192.168.3.89:8848/',
      target: 'http://192.168.3.89:9010/',
      changeOrigin: true,
      pathRewrite: {'^/jetlinks': ''},
    },
  },
  pre: {
    '/jetlinks': {
      // target: 'http://192.168.3.89:8848/',
      target: 'http://192.168.3.89:9010/',
      changeOrigin: true,
      pathRewrite: {'^/jetlinks': ''},
    },
  },
};
