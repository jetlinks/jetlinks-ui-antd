import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
import proxy from './proxy';
import webpackPlugin from './plugin.config';

const { pwa } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  history: 'hash',
  // base: './',
  // publicPath: "./",
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      // component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login2',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          routes: [
            {
              path: '/',
              redirect: '/analysis',
            },
            {
              name: '统计分析',
              path: '/analysis',
              icon: 'bar-chart',
              component: './analysis',
            },
            {
              path: 'system',
              name: '系统设置',
              icon: 'setting',
              authority: ['user', 'role', 'permission', 'dictionary', 'admin'],
              routes: [
                {
                  path: '/system/user',
                  name: '用户管理',
                  authority: ['user', 'admin'],
                  component: './system/users',
                },
                {
                  path: '/system/permission',
                  name: '权限管理',
                  authority: ['permission', 'admin'],
                  component: './system/permission',
                },
                {
                  path: '/system/open-api',
                  name: 'OpenApi客户端',
                  authority: ['open-api', 'admin'],
                  component: './system/open-api',
                },
                {
                  path: '/system/org',
                  name: '机构管理',
                  authority: ['dimension', 'admin'],
                  component: './system/org',
                },
                {
                  path: '/system/role',
                  name: '角色管理',
                  authority: ['dimension', 'admin'],
                  component: './system/role',
                },
                {
                  path: '/system/config',
                  name: '系统配置',
                  authority: ['system-config', 'admin'],
                  component: './system/config',
                },
                {
                  path: 'system/tenant',
                  name: '租户管理',
                  // authority: ['tenant', 'admin'],
                  component: './system/tenant'
                },
                {
                  hideInMenu: true,
                  path: '/system/tenant/detail/:id',
                  name: '租户详情',
                  // authority: ['device-product'],
                  component: './system/tenant/detail',
                },
              ],
            },
            {
              path: 'device',
              name: '设备管理',
              icon: 'usb',
              authority: ['device-product', 'device-instance', 'admin'],
              routes: [
                {
                  path: '/device/protocol',
                  name: '协议管理',
                  authority: ['protocol-supports', 'admin'],
                  component: './device/protocol',
                },
                {
                  path: '/device/product',
                  name: '设备型号',
                  authority: ['device-product', 'admin'],
                  component: './device/product',
                },
                {
                  hideInMenu: true,
                  path: '/device/product/save/:id',
                  name: '编辑设备型号',
                  // authority: ['device-product'],
                  component: './device/product/save/Detail',
                },
                {
                  hideInMenu: true,
                  path: '/device/product/add',
                  name: '添加设备型号',
                  // authority: ['device-product'],
                  component: './device/product/save',
                },
                {
                  path: '/device/instance',
                  name: '设备实例',
                  authority: ['device-instance', 'admin'],
                  component: './device/instance',
                },
                {
                  hideInMenu: true,
                  path: '/device/instance/save/:id',
                  name: '设备详情',
                  component: './device/instance/editor',
                },
                {
                  hideInMenu: true,
                  path: '/device/instance/add',
                  name: '添加设备实例',
                  component: './device/instance/editor',
                },
                {
                  path: '/device/gateway',
                  name: '网关设备',
                  authority: ['device-gateway', 'admin'],
                  component: './device/gateway',
                },
                {
                  path: '/device/location',
                  name: '地理位置',
                  authority: ['geo-manager', 'admin'],
                  component: './device/location',
                }, {
                  path: '/device/firmware',
                  name: '固件升级',
                  authority: ['firmware-manager', 'admin'],
                  component: './device/firmware',
                }, {
                  hideInMenu: true,
                  path: '/device/firmware/save/:id',
                  name: '固件详情',
                  component: './device/firmware/editor',
                },
              ],
            },
            {
              path: 'network',
              name: '网络组件',
              icon: 'appstore',
              authority: ['certificate', 'network-config', 'device-gateway', 'admin'],
              routes: [
                {
                  path: '/network/certificate',
                  name: '证书管理',
                  icon: 'book',
                  authority: ['certificate', 'admin'],
                  component: './network/certificate',
                },
                {
                  path: '/network/type',
                  name: '组件管理',
                  icon: 'flag',
                  authority: ['network-config', 'admin'],
                  component: './network/type',
                },
                {
                  path: '/network/gateway',
                  name: '设备网关',
                  icon: 'thunderbolt',
                  authority: ['device-gateway', 'admin'],
                  component: './network/gateway',
                },
              ],
            },
            {
              path: 'notice',
              name: '通知管理',
              icon: 'sound',
              authority: ['certificate', 'network-config', 'device-gateway', 'admin'],
              routes: [
                {
                  path: '/notice/config',
                  name: '通知配置',
                  icon: 'setting',
                  authority: ['notifier', 'admin'],
                  component: './notice/config',
                },
                {
                  path: 'notice/template',
                  name: '通知模版',
                  icon: 'tags',
                  authority: ['template', 'admin'],
                  component: './notice/template',
                },
              ],
            },
            {
              path: 'rule-engine',
              name: '规则引擎',
              icon: 'share-alt',
              authority: ['rule-model', 'rule-instance', 'sql-rule', 'admin'],
              routes: [
                {
                  path: '/rule-engine/model',
                  name: '规则模型',
                  icon: 'appstore',
                  authority: ['rule-model', 'admin'],
                  component: './rule-engine/model',
                },
                {
                  path: '/rule-engine/instance',
                  name: '规则实例',
                  icon: 'control',
                  authority: ['rule-instance', 'admin'],
                  component: './rule-engine/instance',
                },
                {
                  path: './rule-engine/sqlRule',
                  name: '数据转发',
                  icon: 'control',
                  authority: ['rule-instance', 'admin'],
                  component: './rule-engine/sqlRule',
                },
                // {
                //   path: '/rule-engine/email',
                //   name: 'email',
                //   icon: 'mail',
                //   component: './rule-engine/email',
                // },
                // {
                //   path: '/rule-engine/sms',
                //   name: 'sms',
                //   icon: 'message',
                //   component: './rule-engine/sms',
                // },
              ],
            },
            {
              path: 'logger',
              name: '日志管理',
              icon: 'wallet',
              authority: ['system-logger', 'access-logger', 'admin'],
              routes: [
                {
                  path: './logger/access',
                  name: '访问日志',
                  icon: 'ordered-list',
                  authority: ['access-logger', 'admin'],
                  component: './logger/access',
                },
                {
                  path: './logger/system',
                  name: '系统日志',
                  icon: 'bars',
                  authority: ['system-logger', 'admin'],
                  component: './logger/system',
                },
              ],
            },
            // {
            //   name: 'paramter',
            //   path: '/properties',
            //   inco: 'bar-chart',
            //   component: './script-demo',
            // },
            {
              name: 'exception',
              icon: 'smile',
              path: '/exception',
              hideInMenu: true,
              routes: [
                {
                  path: './500',
                  name: '500',
                  component: './exception/500',
                },
                {
                  path: './404',
                  name: '404',
                  component: './exception/404',
                },
                {
                  path: './403',
                  name: '403',
                  component: './exception/403',
                },
              ],
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
  // proxy: {
  //   '/jetlinks': {
  //     // target: 'http://192.168.3.89:8848/',
  //     target: 'http://2.jetlinks.org:9010/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/jetlinks': '' },
  //   },
  // },
} as IConfig;
