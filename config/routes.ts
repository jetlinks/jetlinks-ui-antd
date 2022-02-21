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
    component: './Analysis',
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
        access: 'user',
        component: './system/User',
      },
      {
        path: '/system/role',
        name: 'role',
        icon: 'smile',
        access: 'role',
        component: './system/Role',
      },
      {
        path: '/system/permission',
        name: 'permission',
        icon: 'smile',
        component: './system/Permission',
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
      {
        hideInMenu: true,
        path: '/system/tenant/detail/:id',
        name: 'tenant-detail',
        icon: 'smile',
        component: './system/Tenant/Detail',
      },
      {
        path: '/system/datasource',
        name: 'datasource',
        icon: 'smile',
        component: './system/DataSource',
      },
      {
        path: '/system/department',
        name: 'department',
        icon: 'smile',
        component: './system/Department',
      },
      {
        hideInMenu: true,
        path: '/system/department/:id/assets',
        name: 'Assets',
        icon: 'smile',
        component: './system/Department/Assets',
      },
      {
        hideInMenu: true,
        path: '/system/department/:id/user',
        name: 'Member',
        icon: 'smile',
        component: './system/Department/Member',
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
        path: '/device/category',
        name: 'category',
        icon: 'smile',
        component: './device/Category',
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
        hideInMenu: true,
        path: '/device/instance/detail/:id',
        name: 'instance-detail',
        icon: 'smile',
        component: './device/Instance/Detail',
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
        component: './device/Firmware',
      },
      {
        hideInMenu: true,
        path: '/device/firmware/detail/:id',
        name: 'firmware-detail',
        icon: 'smile',
        component: './device/Firmware/Detail',
      },
      {
        path: '/device/alarm',
        name: 'alarm',
        icon: 'smile',
        component: './device/Alarm',
      },
      {
        path: '/device/location',
        name: 'location',
        icon: 'smile',
        component: './device/Location',
      },
    ],
  },
  {
    path: '/link',
    name: 'link',
    icon: 'crown',
    routes: [
      {
        path: '/link',
        redirect: '/link/certificate',
      },
      {
        path: '/link/certificate',
        name: 'certificate',
        icon: 'smile',
        component: './link/Certificate',
      },
      {
        path: '/link/protocol',
        name: 'protocol',
        icon: 'smile',
        component: './link/Protocol',
      },
      {
        path: 'link/type',
        name: 'type',
        icon: 'smile',
        component: './link/Type',
      },
      {
        path: '/link/gateway',
        name: 'gateway',
        icon: 'smile',
        component: './link/Gateway',
      },
      {
        path: '/link/opcua',
        name: 'opcua',
        icon: 'smile',
        component: './link/Opcua',
      },
    ],
  },
  {
    path: '/notice',
    name: 'notice',
    icon: 'crown',
    routes: [
      {
        path: '/notice',
        redirect: '/notice/config',
      },
      {
        path: '/notice/config',
        name: 'config',
        icon: 'smile',
        component: './notice/Config',
      },
      {
        path: '/notice/template',
        name: 'template',
        icon: 'smile',
        component: './notice/Template',
      },
    ],
  },
  {
    path: '/rule-engine',
    name: 'rule-engine',
    icon: 'crown',
    routes: [
      {
        path: '/rule-engine',
        redirect: '/rule-engine/instance',
      },
      {
        path: '/rule-engine/instance',
        name: 'instance',
        icon: 'smile',
        component: './rule-engine/Instance',
      },
      {
        path: '/rule-engine/sqlRule',
        name: 'sqlRule',
        icon: 'smile',
        component: './rule-engine/SQLRule',
      },
      {
        path: '/rule-engine/scene',
        name: 'scene',
        icon: 'smile',
        component: './rule-engine/Scene',
      },
    ],
  },
  {
    path: '/visualization',
    name: 'visualization',
    icon: 'crown',
    routes: [
      {
        path: '/visualization',
        redirect: '/visualization/category',
      },
      {
        path: '/visualization/category',
        name: 'category',
        icon: 'smile',
        component: './visualization/Category',
      },
      {
        path: '/visualization/screen',
        name: 'screen',
        icon: 'smile',
        component: './visualization/Screen',
      },
      {
        path: '/visualization/configuration',
        name: 'configuration',
        icon: 'smile',
        component: './visualization/Configuration',
      },
    ],
  },
  {
    path: '/simulator',
    name: 'simulator',
    icon: 'crown',
    routes: [
      {
        path: '/simulator',
        redirect: '/simulator/device',
      },
      {
        path: '/simulator/device',
        name: 'device',
        icon: 'smile',
        component: './simulator/Device',
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
    path: '/cloud',
    name: 'cloud',
    icon: 'crown',
    routes: [
      {
        path: '/cloud',
        redirect: '/cloud/duer',
      },
      {
        path: '/cloud/dueros',
        name: 'DuerOS',
        icon: 'smile',
        component: './cloud/DuerOS',
      },
      {
        path: '/cloud/aliyun',
        name: 'aliyun',
        icon: 'smile',
        component: './cloud/Aliyun',
      },
      {
        path: '/cloud/onenet',
        name: 'onenet',
        icon: 'smile',
        component: './cloud/Onenet',
      },
      {
        path: '/cloud/ctwing',
        name: 'ctwing',
        icon: 'smile',
        component: './cloud/Ctwing',
      },
    ],
  },
  {
    path: '/media',
    name: 'media',
    icon: 'crown',
    routes: [
      {
        path: '/media',
        redirect: '/media/config',
      },
      {
        path: '/media/config',
        name: 'config',
        icon: 'smile',
        component: './media/Config',
      },
      {
        path: '/media/device',
        name: 'device',
        icon: 'smile',
        component: './media/Device',
      },
      {
        path: '/media/reveal',
        name: 'reveal',
        icon: 'smile',
        component: './media/Reveal',
      },
      {
        path: '/media/cascade',
        name: 'cascade',
        icon: 'smile',
        component: './media/Cascade',
      },
    ],
  },
  {
    path: '/edge',
    name: 'edge',
    icon: 'crown',
    routes: [
      {
        path: '/edge',
        redirect: '/edge/product',
      },
      {
        path: '/edge/product',
        name: 'product',
        icon: 'smile',
        component: './edge/Product',
      },
      {
        path: '/edge/device',
        name: 'device',
        icon: 'smile',
        component: './edge/Device',
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
