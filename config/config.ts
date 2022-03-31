// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  history: {
    type: 'hash',
  },
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  lessLoader: {
    modifyVars: {
      'root-entry-name': 'default', // 解决antd 4.17.0-alpha.9 bug 官方发布正式版后可尝试移除
    },
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: { type: 'none' },
  // mfsu: {},
  webpack5: {},
  copy: [
    { from: 'node_modules/@liveqing/liveplayer/dist/element/liveplayer.swf', to: '/' },
    { from: 'node_modules/@liveqing/liveplayer/dist/element/crossdomain.xml', to: '/' },
    { from: 'node_modules/@liveqing/liveplayer/dist/element/liveplayer-element.min.js', to: '/' },
  ],
  headScripts: [{ src: './liveplayer-element.min.js', defer: true }],
  // exportStatic: {},
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    memo.plugin('monaco-editor').use(
      new MonacoWebpackPlugin({
        languages: ['json', 'javascript', 'typescript', 'sql'],
      }),
    );
  },
});
