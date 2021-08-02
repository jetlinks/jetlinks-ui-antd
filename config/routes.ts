export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/analysis',
    name: 'analysis',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/system',
    name: 'system',
    icon: 'crown',
    routes: [
      {
        path: '/system',
        redirect: '/system/user',
      },
      {
        path: '/system/user',
        name: 'user',
        icon: 'smile',
        component: './system/User',
      },
      {
        path: '/system/role',
        name: 'role',
        icon: 'smile',
        component: './system/Role',
      },
      {
        path: '/system/permission',
        name: 'permission',
        icon: 'smile',
        component: './system/Permission',
      },
      {
        path: '/system/org',
        name: 'org',
        icon: 'smile',
        component: './system/Org',
      },
      {
        path: '/system/open-api',
        name: 'open-api',
        icon: 'smile',
        component: './system/OpenAPI',
      },
      {
        path: '/system/tenant',
        name: 'tenant',
        icon: 'smile',
        component: './system/Tenant',
      },
    ],
  },
  {
    path: '/device',
    name: 'device',
    icon: 'crown',
    routes: [
      {
        path: '/device',
        redirect: '/device/product',
      },
      {
        path: '/device/product',
        name: 'product',
        icon: 'smile',
        component: './device/Product',
      },
      {
        hideInMenu: true,
        path: '/device/product/detail/:id',
        name: 'product-detail',
        icon: 'smile',
        component: './device/Product/Detail',
      },
      {
        path: '/device/instance',
        name: 'instance',
        icon: 'smile',
        component: './device/Instance',
      },
      {
        path: '/device/command',
        name: 'command',
        icon: 'smile',
        component: './device/Command',
      },
      {
        path: '/device/firmware',
        name: 'firmware',
        icon: 'smile',
        component: './device/firmware',
      },
      {
        path: '/device/alarm',
        name: 'alarm',
        icon: 'smile',
        component: './device/alarm',
      },
    ],
  },
  {
    path: '/log',
    name: 'log',
    icon: 'crown',
    routes: [
      {
        path: '/log',
        redirect: '/log/access',
      },
      {
        path: '/log/access',
        name: 'access',
        icon: 'smile',
        component: './log/Access',
      },
      {
        path: '/log/system',
        name: 'system',
        icon: 'smile',
        component: './log/System',
      },
    ],
  },
  {
    path: '/',
    redirect: '/analysis',
  },
  {
    component: './404',
  },
];
