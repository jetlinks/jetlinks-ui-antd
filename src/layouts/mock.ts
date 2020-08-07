export const menuData = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
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
            // authority: ['user', 'role', 'permission', 'dictionary'],
            routes: [
              {
                path: '/system/user',
                name: '用户管理',
                authority: ['user'],
                component: './system/users',
              },
              // {
              //   path: '/system/setting-autz',
              //   name: '功能权限管理',
              //   // authority: ['role'],
              //   component: './system/setting-autz',
              // },
              {
                path: '/system/permission',
                name: '权限管理',
                authority: ['permission'],
                component: './system/permission',
              },
              // {
              //   path: '/system/dictionary',
              //   name: 'dictionary',
              //   // authority: ['dictionary'],
              //   component: './system/dictionary',
              // },
              {
                path: '/system/open-api',
                name: 'OpenApi客户端',
                authority: ['open-api'],
                component: './system/open-api',
              },
            ],
          },
          {
            path: 'device',
            name: '设备管理',
            icon: 'usb',
            authority: ['device-product', 'device-instance'],
            routes: [
              {
                path: '/device/protocol',
                name: '协议管理',
                authority: ['protocol-supports'],
                component: './device/protocol',
              },
              {
                path: '/device/product',
                name: '产品管理',
                authority: ['device-product'],
                component: './device/product',
              },
              {
                hideInMenu: true,
                path: '/device/product/save/:id',
                name: '编辑产品',
                // authority: ['device-product'],
                component: './device/product/save/Detail',
              },
              {
                hideInMenu: true,
                path: '/device/product/add',
                name: '添加产品',
                // authority: ['device-product'],
                component: './device/product/save',
              },
              {
                path: '/device/instance',
                name: '设备管理',
                authority: ['device-instance'],
                component: './device/instance',
              },
              {
                hideInMenu: true,
                path: '/device/instance/save/:id',
                name: '编辑产品',
                component: './device/instance/editor',
              },
              {
                hideInMenu: true,
                path: '/device/instance/add',
                name: '添加产品',
                component: './device/instance/editor',
              },
            ],
          },
          {
            path: 'network',
            name: '网络组件',
            icon: 'appstore',
            authority: ['certificate', 'network-config', 'device-gateway'],
            routes: [
              {
                path: '/network/certificate',
                name: '证书管理',
                icon: 'book',
                authority: ['certificate'],
                component: './network/certificate',
              },
              {
                path: '/network/type',
                name: '组件管理',
                icon: 'flag',
                authority: ['network-config'],
                component: './network/type',
              },
              {
                path: '/network/gateway',
                name: '设备网关',
                icon: 'thunderbolt',
                authority: ['device-gateway'],
                component: './network/gateway',
              },
            ],
          },
          {
            path: 'notice',
            name: '通知管理',
            icon: 'sound',
            authority: ['certificate', 'network-config', 'device-gateway'],
            routes: [
              {
                path: '/notice/config',
                name: '通知配置',
                icon: 'setting',
                authority: ['notifier'],
                component: './notice/config',
              },
              {
                path: 'notice/template',
                name: '通知模版',
                icon: 'tags',
                authority: ['template'],
                component: './notice/template',
              },
            ],
          },
          {
            path: 'rule-engine',
            name: '规则引擎',
            icon: 'share-alt',
            authority: ['rule-model', 'rule-instance'],
            routes: [
              {
                path: '/rule-engine/model',
                name: '规则模型',
                icon: 'appstore',
                authority: ['rule-model'],
                component: './rule-engine/model',
              },
              {
                path: '/rule-engine/instance',
                name: '规则实例',
                icon: 'control',
                authority: ['rule-instance'],
                component: './rule-engine/instance',
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
            authority: ['rule-logger', 'access-logger'],
            routes: [
              {
                path: './logger/access',
                name: '访问日志',
                icon: 'ordered-list',
                authority: ['rule-logger'],
                component: './logger/access',
              },
              {
                path: './logger/system',
                name: '系统日志',
                icon: 'bars',
                authority: ['access-logger'],
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
];
