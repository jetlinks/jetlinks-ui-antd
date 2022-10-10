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
    path: '/account/center/bind',
    layout: false,
    routes: [
      {
        path: '/account/center/bind',
        routes: [
          {
            name: 'bind',
            path: '/account/center/bind',
            component: './account/Center/bind',
          },
        ],
      },
    ],
  },
  {
    path: '/init-home',
    layout: false,
    routes: [
      {
        name: '初始化',
        path: '/init-home',
        component: './init-home',
      },
    ],
  },
  {
    path: '/init-license',
    layout: false,
    routes: [
      {
        name: '初始化License',
        path: '/init-license',
        component: './system/License/init',
      },
    ],
  },
  {
    path: '/oauth',
    layout: false,
    routes: [
      {
        name: '授权页',
        path: '/oauth',
        component: './oauth',
      },
    ],
  },
  // {
  //   path: '/analysis',
  //   name: 'analysis',
  //   icon: 'smile',
  //   component: './Analysis',
  // },
  // {
  //   path: '/system',
  //   name: 'system',
  //   icon: 'crown',
  //   routes: [
  //     {
  //       path: '/system/user',
  //       name: 'user',
  //       icon: 'smile',
  //       access: 'user',
  //       component: './system/User',
  //     },
  //     {
  //       path: '/system/department',
  //       name: 'department',
  //       icon: 'smile',
  //       component: './system/Department',
  //     },
  //     {
  //       hideInMenu: true,
  //       path: '/system/department/:id/assets',
  //       name: 'assets',
  //       icon: 'smile',
  //       component: './system/Department/Assets',
  //     },
  //     {
  //       hideInMenu: true,
  //       path: '/system/department/:id/user',
  //       name: 'member',
  //       icon: 'smile',
  //       component: './system/Department/Member',
  //     },
  //     {
  //       path: '/system/role',
  //       name: 'role',
  //       icon: 'smile',
  //       access: 'role',
  //       component: './system/Role',
  //     },
  //     {
  //       hideInMenu: true,
  //       path: '/system/role/edit/:id',
  //       name: 'role-edit',
  //       icon: 'smile',
  //       component: './system/Role/Edit',
  //     },
  //     {
  //       path: '/system/permission',
  //       name: 'permission',
  //       icon: 'smile',
  //       component: './system/Permission',
  //     },
  //     {
  //       path: '/system/menu',
  //       name: 'menu',
  //       icon: 'smile',
  //       component: './system/Menu',
  //     },
  //     {
  //       path: '/system/menu/detail',
  //       name: 'menuDetail',
  //       icon: 'smile',
  //       hideInMenu: true,
  //       component: './system/Menu/Detail',
  //     },
  //     // {
  //     //   path: '/system/open-api',
  //     //   name: 'open-api',
  //     //   icon: 'smile',
  //     //   component: './system/OpenAPI',
  //     // },
  //     // {
  //     //   path: '/system/tenant',
  //     //   name: 'tenant',
  //     //   icon: 'smile',
  //     //   component: './system/Tenant',
  //     // },
  //     {
  //       hideInMenu: true,
  //       path: '/system/tenant/detail/:id',
  //       name: 'tenant-detail',
  //       icon: 'smile',
  //       component: './system/Tenant/Detail',
  //     },
  //     // {
  //     //   path: '/system/datasource',
  //     //   name: 'datasource',
  //     //   icon: 'smile',
  //     //   component: './system/DataSource',
  //     // },
  //     //
  //   ],
  // },
  // {
  //   path: '/',
  //   redirect: '/system4',
  // },
];
