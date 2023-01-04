export default [
  // 物联网
  {
    code: 'iot',
    name: '物联网',
    owner: 'iot',
    // //id: '1',
    url: '/iot',
    icon: 'icon-wulianwang',
    sortIndex: 1,
    permissions: [],
    children: [
      {
        code: 'home',
        name: '首页',
        owner: 'iot',
        //parentId: '1',
        //id: '1-1',
        url: '/iot/home',
        icon: 'icon-zhihuishequ',
        sortIndex: 1,
        showPage: ['dashboard', 'device-instance', 'device-product'],
        permissions: [
          {
            permission: 'device-product',
            actions: ['query'],
          },
          {
            permission: 'device-instance',
            actions: ['query'],
          },
          {
            permission: 'dashboard',
            actions: ['query'],
          },
          {
            permission: 'system_config',
            actions: ['query'],
          },
          {
            permission: 'open-api',
            actions: ['query'],
          },
        ],
      },
      {
        code: 'notice',
        name: '通知管理',
        owner: 'iot',
        //parentId: '1',
        //id: '1-2',
        url: '/iot/notice',
        icon: 'icon-tongzhiguanli',
        sortIndex: 2,
        showPage: ['template', 'notifier'],
        permissions: [],
        children: [
          {
            code: 'notice/Config',
            name: '通知配置',
            owner: 'iot',
            //parentId: '1',
            //id: '1-2',
            url: '/iot/notice/Config',
            icon: 'icon-tongzhiguanli',
            sortIndex: 1,
            showPage: ['notifier'],
            permissions: [],
            buttons: [
              {
                id: 'bind',
                name: '同步用户',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'user-third-party-manager',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'user',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'log',
                name: '通知记录',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'debug',
                name: '调试',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'send'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'user',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'export',
                name: '导出',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'import',
                name: '导入',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'template',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'template',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'template',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'template',
                    actions: ['query', 'save'],
                  },
                ],
              },
            ],
          },
          {
            code: 'notice/Template',
            name: '通知模板',
            owner: 'iot',
            //parentId: '1',
            //id: '1-2',
            url: '/iot/notice/Template',
            icon: 'icon-tongzhiguanli',
            sortIndex: 2,
            showPage: ['template'],
            permissions: [],
            buttons: [
              // {
              //   id: 'bind',
              //   name: '同步用户',
              //   permissions: [
              //     {
              //       permission: 'notifier',
              //       actions: ['query'],
              //     },
              //     {
              //       permission: 'template',
              //       actions: ['query'],
              //     },
              //     {
              //       permission: 'user-third-party-manager',
              //       actions: ['query', 'save'],
              //     },
              //     {
              //       permission: 'user',
              //       actions: ['query'],
              //     },
              //   ],
              // },
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'log',
                name: '通知记录',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'debug',
                name: '调试',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'send'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'user',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'export',
                name: '导出',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'import',
                name: '导入',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'template',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'template',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'template',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'notifier',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'template',
                    actions: ['query', 'save'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'device',
        name: '设备管理',
        owner: 'iot',
        //parentId: '1',
        //id: '1-3',
        url: '/iot/device',
        icon: 'icon-shebei',
        sortIndex: 3,
        permissions: [],
        showPage: [],
        children: [
          {
            code: 'device/DashBoard',
            name: '仪表盘',
            owner: 'iot',
            //parentId: '1-3',
            //id: '1-3-1',
            url: '/iot/device/DashBoard',
            icon: 'icon-keshihua',
            sortIndex: 1,
            showPage: ['dashboard', 'device-product', 'device-instance'],
            permissions: [
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'dashboard',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
              {
                permission: 'geo-manager',
                actions: ['find-geo'],
              },
            ],
          },
          {
            code: 'device/Product',
            name: '产品',
            owner: 'iot',
            //parentId: '1-3',
            //id: '1-3-2',
            url: '/iot/device/Product',
            icon: 'icon-chanpin',
            sortIndex: 2,
            accessSupport: 'support',
            assetType: 'product',
            showPage: ['device-product'],
            permissions: [
              {
                permission: 'transparent-codec',
                actions: ['query', 'save'],
              },
              {
                permission: 'network-config',
                actions: ['query'],
              },
              {
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-category',
                actions: ['query'],
              },
              {
                permission: 'device-mapping',
                actions: ['query', 'save'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-mapping',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'export',
                name: '导出',
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'import',
                name: '导入',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['delete'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'device/Instance',
            name: '设备',
            owner: 'iot',
            //parentId: '1-3',
            //id: '1-3-3',
            url: '/iot/device/Instance',
            icon: 'icon-shebei',
            sortIndex: 3,
            accessSupport: 'support',
            assetType: 'device',
            showPage: ['device-instance'],
            permissions: [
              {
                permission: 'transparent-codec',
                actions: ['query'],
              },
              {
                permission: 'device-api',
                actions: ['query-device-events'],
              },
              {
                permission: 'things-collector',
                actions: ['save', 'delete'],
              },
            ],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'export',
                name: '导出',
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'import',
                name: '导入',
                permissions: [
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'visualization',
                    actions: ['query'],
                  },
                  {
                    permission: 'organization',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-opt-api',
                    actions: ['read-property', 'invoke-function', 'write-property'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'dictionary',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-category',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-mapping',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'media-server',
                    actions: ['query'],
                  },
                  {
                    permission: 'dashboard',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'device/Category',
            name: '产品分类',
            owner: 'iot',
            //parentId: '1-3',
            //id: '1-3-4',
            sortIndex: 4,
            url: '/iot/device/Category',
            icon: 'icon-chanpinfenlei',
            accessSupport: 'support',
            assetType: 'deviceCategory',
            showPage: ['device-category'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'device-category',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'device-category',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'device-category',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'device-category',
                    actions: ['query', 'save'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'link',
        name: '运维管理',
        owner: 'iot',
        //parentId: '1',
        //id: '1-4',
        url: '/iot/link',
        icon: 'icon-yunweiguanli-1',
        permissions: [],
        sortIndex: 4,
        children: [
          {
            code: 'link/DashBoard',
            name: '仪表盘',
            owner: 'iot',
            //parentId: '1-4',
            //id: '1-4-1',
            sortIndex: 1,
            url: '/iot/link/dashboard',
            icon: 'icon-keshihua',
            showPage: ['dashboard', 'network-config'],
            permissions: [
              {
                permission: 'network-config',
                actions: ['query'],
              },
              {
                permission: 'dashboard',
                actions: ['query'],
              },
            ],
          },
          {
            code: 'link/AccessConfig',
            name: '设备接入网关',
            owner: 'iot',
            //parentId: '1-4',
            //id: '1-4-2',
            sortIndex: 2,
            url: '/iot/link/accessConfig',
            icon: 'icon-wangguanzishebei',
            showPage: ['device-gateway'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'device-gateway',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'opc-point',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'opc-client',
                    actions: ['query', 'save', 'delete'],
                  },
                  {
                    permission: 'opc-device-bind',
                    actions: ['query', 'save', 'delete'],
                  },
                  {
                    permission: 'gb28181-cascade',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                  {
                    permission: 'opc-point',
                    actions: ['query'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'media-gateway',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-gateway',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'opc-client',
                    actions: ['query'],
                  },
                  {
                    permission: 'opc-device-bind',
                    actions: ['query'],
                  },
                  {
                    permission: 'gb28181-cascade',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'link/Protocol',
            name: '协议管理',
            owner: 'iot',
            //parentId: '1-4',
            //id: '1-4-3',
            sortIndex: 3,
            url: '/iot/link/protocol',
            icon: 'icon-tongzhiguanli',
            showPage: ['protocol-supports'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query'],
                  },
                ],
              },
              // {
              //   id: 'action',
              //   name: '启/禁用',
              //   permissions: [
              //     {
              //       permission: 'protocol-supports',
              //       actions: ['enable', 'disable', 'query', 'save'],
              //     },
              //   ],
              // },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'system_config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'file',
                    actions: ['upload-static'],
                  },
                  {
                    permission: 'system_config',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'Log',
            name: '日志管理',
            owner: 'iot',
            //parentId: '1-4',
            //id: '1-4-4',
            sortIndex: 4,
            url: '/iot/link/Log',
            icon: 'icon-rizhifuwu',
            showPage: ['system-logger', 'access-logger'],
            permissions: [
              {
                permission: 'system-logger',
                actions: ['query'],
              },
              {
                permission: 'access-logger',
                actions: ['self-data', 'query'],
              },
            ],
            buttons: [],
          },
          {
            code: 'link/Type',
            name: '网络组件',
            owner: 'iot',
            //parentId: '1-4',
            //id: '1-4-5',
            sortIndex: 5,
            url: '/iot/link/type',
            icon: 'icon-wangluozujian',
            showPage: ['network-config'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query', 'save', 'action'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'network-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'link/Certificate',
            name: '证书管理',
            owner: 'iot',
            //parentId: '1-4',
            //id: '1-4-6',
            sortIndex: 6,
            url: '/iot/link/Certificate',
            icon: 'icon-zhengshuguanli',
            showPage: ['certificate'],
            permissions: [],
            buttons: [
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'certificate',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'certificate',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'certificate',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'media/Stream',
            name: '流媒体服务',
            owner: 'iot',
            //parentId: '1-4',
            //id: '1-4-7',
            sortIndex: 7,
            url: '/iot/link/Stream',
            icon: 'icon-xuanzetongdao1',
            showPage: ['media-server'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'media-server',
                    actions: ['query', 'save'],
                  },
                ],
              },
            ],
          },
          // {
          //   code: 'link/Channel',
          //   name: '通道配置',
          //   owner: 'iot',
          //   //parentId: '1-4',
          //   //id: '1-4-8',
          //   sortIndex: 8,
          //   url: '/iot/link/Channel',
          //   icon: 'icon-zidingyiguize',
          //   showPage: ['media-server'],
          //   permissions: [],
          //   children: [
          //     {
          //       code: 'link/Channel/Opcua',
          //       name: 'OPC UA',
          //       owner: 'iot',
          //       //parentId: '1-4-8',
          //       //id: '1-4-8-1',
          //       sortIndex: 1,
          //       url: '/iot/link/Channel/Opcua',
          //       icon: 'icon-zhilianshebei',
          //       showPage: ['opc-client'],
          //       permissions: [
          //         { permission: 'opc-device-bind', actions: ['query'] },
          //         { permission: 'opc-point', actions: ['query'] },
          //         { permission: 'opc-client', actions: ['query'] },
          //       ],
          //       buttons: [
          //         {
          //           id: 'view',
          //           name: '设备接入',
          //           permissions: [
          //             { permission: 'opc-point', actions: ['query'] },
          //             { permission: 'opc-device-bind', actions: ['query'] },
          //             { permission: 'opc-client', actions: ['query'] },
          //           ],
          //         },
          //         {
          //           id: 'action',
          //           name: '启/禁用',
          //           permissions: [
          //             { permission: 'opc-point', actions: ['query', 'save'] },
          //             { permission: 'opc-client', actions: ['query', 'save'] },
          //           ],
          //         },
          //         {
          //           id: 'update',
          //           name: '编辑',
          //           permissions: [
          //             { permission: 'opc-point', actions: ['query', 'save'] },
          //             { permission: 'opc-device-bind', actions: ['query', 'save'] },
          //             { permission: 'opc-client', actions: ['query', 'save'] },
          //           ],
          //         },
          //         {
          //           id: 'delete',
          //           name: '删除',
          //           permissions: [
          //             { permission: 'opc-point', actions: ['query', 'delete'] },
          //             { permission: 'opc-device-bind', actions: ['query', 'delete'] },
          //             { permission: 'opc-client', actions: ['query', 'delete'] },
          //           ],
          //         },
          //         {
          //           id: 'add',
          //           name: '新增',
          //           permissions: [
          //             { permission: 'opc-point', actions: ['query', 'save'] },
          //             { permission: 'opc-device-bind', actions: ['query', 'save'] },
          //             { permission: 'opc-client', actions: ['query', 'save'] },
          //           ],
          //         },
          //       ],
          //     },
          //     {
          //       code: 'link/Channel/Modbus',
          //       name: 'Modbus',
          //       owner: 'iot',
          //       //parentId: '1-4-8',
          //       //id: '1-4-8-2',
          //       sortIndex: 2,
          //       url: '/iot/link/Channel/Modbus',
          //       icon: 'icon-changjingliandong',
          //       showPage: ['modbus-master'],
          //       permissions: [
          //         { permission: 'modbus-point', actions: ['query', 'save', 'delete'] },
          //         { permission: 'modbus-master', actions: ['query', 'save', 'delete'] },
          //       ],
          //       buttons: [
          //         {
          //           id: 'update',
          //           name: '编辑',
          //           permissions: [{ permission: 'modbus-master', actions: ['query', 'save'] }],
          //         },
          //         {
          //           id: 'action',
          //           name: '启/禁用',
          //           permissions: [{ permission: 'modbus-master', actions: ['query', 'save'] }],
          //         },
          //         {
          //           id: 'view',
          //           name: '设备接入',
          //           permissions: [{ permission: 'modbus-master', actions: ['query', 'save'] }],
          //         },
          //         {
          //           id: 'delete',
          //           name: '删除',
          //           permissions: [{ permission: 'modbus-master', actions: ['query', 'delete'] }],
          //         },
          //         {
          //           id: 'add',
          //           name: '新增',
          //           permissions: [{ permission: 'modbus-master', actions: ['query', 'save'] }],
          //         },
          //       ],
          //     },
          //   ],
          // },
          {
            code: 'device/Firmware',
            name: '远程升级',
            owner: 'iot',
            //parentId: '1-4',
            //id: '1-4-9',
            sortIndex: 9,
            url: '/iot/link/firmware',
            icon: 'icon-yuanchengshengji',
            showPage: ['firmware-manager'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'firmware-manager',
                    actions: ['query'],
                  },
                  {
                    permission: 'firmware-upgrade-task-manager',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'firmware-manager',
                    actions: ['query'],
                  },
                  {
                    permission: 'system_config',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'firmware-upgrade-task-manager',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'firmware-manager',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'firmware-upgrade-task-manager',
                    actions: ['delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'firmware-manager',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'system_config',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                  {
                    permission: 'firmware-upgrade-task-manager',
                    actions: ['query', 'save', 'deploy'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'link/DataCollect',
        name: '数据采集',
        owner: 'iot',
        sortIndex: 10,
        url: '/iot/link/DataCollect',
        icon: 'icon-analytics',
        showPage: [],
        permissions: [],
        children: [
          {
            code: 'DataCollect/Dashboard',
            name: '仪表盘',
            owner: 'iot',
            sortIndex: 1,
            url: '/iot/DataCollect/Dashboard',
            icon: 'icon-keshihua',
            showPage: [
              'dashboard',
              'data-collect-channel',
              'data-collect-opc',
              'data-collector',
              'things-collector',
            ],
            permissions: [
              { permission: 'dashboard', actions: ['query'] },
              { permission: 'data-collect-channel', actions: ['query'] },
              { permission: 'data-collect-opc', actions: ['query'] },
              { permission: 'data-collector', actions: ['query'] },
              { permission: 'things-collector', actions: ['query'] },
            ],
            buttons: [],
          },
          {
            code: 'DataCollect/Channel',
            name: '通道管理',
            owner: 'iot',
            sortIndex: 2,
            url: '/iot/DataCollect/Channel',
            icon: 'icon-rizhifuwu',
            showPage: [
              'data-collect-channel',
              'data-collect-opc',
              'data-collector',
              'things-collector',
            ],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '禁用/启用',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['delete', 'query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'DataCollect/Collector',
            name: '采集器',
            owner: 'iot',
            sortIndex: 3,
            url: '/iot/DataCollect/Collector',
            icon: 'icon-yingyongguanli',
            showPage: [
              'data-collect-channel',
              'data-collect-opc',
              'data-collector',
              'things-collector',
            ],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'certificate',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '禁用/启用',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['save', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['save', 'query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'data-collect-channel',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'data-collector',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'data-collect-opc',
                    actions: ['delete', 'query'],
                  },
                  {
                    permission: 'things-collector',
                    actions: ['delete', 'query'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'rule-engine/Alarm',
        name: '告警中心',
        owner: 'iot',
        //parentId: '1',
        //id: '1-5',
        sortIndex: 5,
        url: '/iot/Alarm',
        icon: 'icon-shebeigaojing',
        permissions: [],
        buttons: [],
        showPage: [],
        children: [
          {
            code: 'rule-engine/DashBoard',
            name: '仪表盘',
            owner: 'iot',
            //parentId: '1-5',
            //id: '1-5-1',
            sortIndex: 1,
            url: '/iot/Alarm/dashboard',
            icon: 'icon-keshihua',
            showPage: ['dashboard', 'alarm-record', 'alarm-config'],
            permissions: [
              { permission: 'dashboard', actions: ['query'] },
              { permission: 'alarm-config', actions: ['query'] },
              { permission: 'alarm-record', actions: ['query'] },
            ],
            buttons: [],
          },
          {
            code: 'rule-engine/Alarm/Config',
            name: '基础配置',
            owner: 'iot',
            //parentId: '1-5',
            //id: '1-5-3',
            sortIndex: 2,
            url: '/iot/Alarm/Config',
            icon: 'icon-chajianguanli',
            showPage: ['alarm-config'],
            permissions: [],
            buttons: [
              {
                id: 'update',
                name: '保存',
                permissions: [
                  { permission: 'alarm-record', actions: ['query', 'save'] },
                  { permission: 'alarm-config', actions: ['query'] },
                ],
              },
            ],
          },
          {
            code: 'rule-engine/Alarm/Configuration',
            name: '告警配置',
            owner: 'iot',
            //parentId: '1-5',
            //id: '1-5-2',
            sortIndex: 3,
            url: '/iot/Alarm/Configuration',
            icon: 'icon-warning_amber',
            showPage: ['alarm-config'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'alarm-record',
                    actions: ['query'],
                  },
                  {
                    permission: 'alarm-config',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'tigger',
                name: '手动触发',
                permissions: [
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                ],
              },
            ],
          },
          {
            code: 'rule-engine/Alarm/Log',
            name: '告警记录',
            owner: 'iot',
            //parentId: '1-5',
            //id: '1-5-4',
            sortIndex: 4,
            url: '/iot/Alarm/Log',
            icon: 'icon-changjingliandong',
            showPage: ['alarm-record'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'alarm-record',
                    actions: ['query'],
                  },
                  {
                    permission: 'organization',
                    actions: ['query'],
                  },
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '告警处理',
                permissions: [
                  {
                    permission: 'alarm-record',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'organization',
                    actions: ['query'],
                  },
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'Northbound',
        name: '北向输出',
        owner: 'iot',
        //parentId: '1',
        //id: '1-6',
        sortIndex: 6,
        url: '/iot/northbound',
        icon: 'icon-yunyunjieru',
        permissions: [],
        buttons: [],
        showPage: [],
        children: [
          {
            code: 'Northbound/DuerOS',
            name: 'DuerOS',
            owner: 'iot',
            //parentId: '1-6',
            //id: '1-6-1',
            sortIndex: 1,
            url: '/iot/northbound/DuerOS',
            icon: 'icon-zhineng',
            permissions: [],
            showPage: ['dueros-product'],
            buttons: [
              {
                id: 'action',
                name: '状态切换',
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'dueros-product',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'Northbound/AliCloud',
            name: '阿里云',
            owner: 'iot',
            //parentId: '1-6',
            //id: '1-6-2',
            sortIndex: 2,
            url: '/iot/northbound/AliCloud',
            icon: 'icon-aliyun',
            permissions: [],
            showPage: ['aliyun-bridge'],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启用/禁用',
                permissions: [
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'aliyun-bridge',
                    actions: ['query', 'save'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'rule-engine',
        name: '规则引擎',
        owner: 'iot',
        //parentId: '1',
        //id: '1-7',
        sortIndex: 7,
        url: '/iot/rule-engine',
        icon: 'icon-zidingyiguize',
        permissions: [],
        buttons: [],
        children: [
          {
            code: 'rule-engine/Instance',
            name: '规则编排',
            owner: 'iot',
            //parentId: '1-7',
            //id: '1-7-1',
            sortIndex: 1,
            url: '/iot/rule-engine/Instance',
            icon: 'icon-changjingliandong',
            showPage: ['rule-instance'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['stop', 'query', 'start', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'network-config',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'datasource-config',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
          {
            code: 'rule-engine/Scene',
            name: '场景联动',
            owner: 'iot',
            //parentId: '1-7',
            //id: '1-7-2',
            sortIndex: 2,
            url: '/iot/rule-engine/scene',
            icon: 'icon-yunweiguanli-1',
            showPage: ['rule-scene'],
            permissions: [],
            buttons: [
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'delete'],
                  },
                  {
                    permission: 'alarm-config',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'tigger',
                name: '手动触发',
                permissions: [
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                ],
              },
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'user',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启用/禁用',
                permissions: [
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'user',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'template',
                    actions: ['query'],
                  },
                  {
                    permission: 'user',
                    actions: ['query'],
                  },
                  {
                    permission: 'rule-scene',
                    actions: ['query', 'save', 'execute'],
                  },
                  {
                    permission: 'notifier',
                    actions: ['query'],
                  },
                  {
                    permission: 'device-product',
                    actions: ['query'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'edge',
        name: '边缘网关',
        owner: 'iot',
        sortIndex: 8,
        url: '/iot/edge',
        icon: 'icon-bianyuanwangguan',
        permissions: [],
        buttons: [],
        children: [
          {
            code: 'edge/Device',
            name: '网关设备',
            owner: 'iot',
            sortIndex: 1,
            url: '/iot/edge/Devic',
            icon: 'icon-bumenguanli',
            showPage: ['edge-operations'],
            permissions: [],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query'],
                  },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'import',
                name: '导入',
                permissions: [
                  {
                    permission: 'rule-instance',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'setting',
                name: '远程控制',
                permissions: [
                  {
                    permission: 'rule-instance',
                    actions: ['save'],
                  },
                ],
              },
              {
                id: 'password',
                name: '重置密码',
                permissions: [
                  {
                    permission: 'rule-instance',
                    actions: ['save'],
                  },
                ],
              },
            ],
          },
          {
            code: 'edge/Resource',
            name: '资源库',
            owner: 'iot',
            sortIndex: 2,
            url: '/iot/edge/Resource',
            icon: 'icon-Vector',
            showPage: ['edge-operations'],
            permissions: [],
            buttons: [
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [
                  {
                    permission: 'device-instance',
                    actions: ['query', 'delete'],
                  },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save'],
                  },
                ],
              },
              {
                id: 'setting',
                name: '下发',
                permissions: [
                  {
                    permission: 'rule-instance',
                    actions: ['query', 'save'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 视频中心
  {
    code: 'media',
    name: '视频中心',
    owner: 'iot',
    //id: '2',
    url: '/media',
    icon: 'icon-shipinwangguan',
    sortIndex: 2,
    accessSupport: 'indirect',
    indirectMenus: ['1-3-3'],
    permissions: [],
    buttons: [],
    children: [
      {
        code: 'media/Home',
        name: '首页',
        owner: 'iot',
        //parentId: '2',
        //id: '2-1',
        sortIndex: 1,
        url: '/media/home',
        icon: 'icon-zhihuishequ',
        permissions: [],
        buttons: [],
        showPage: ['media-device'],
      },
      {
        code: 'media/DashBoard',
        name: '仪表盘',
        owner: 'iot',
        //parentId: '2',
        //id: '2-2',
        sortIndex: 2,
        url: '/media/dashboard',
        icon: 'icon-keshihua',
        permissions: [],
        buttons: [],
        showPage: ['dashboard', 'media-device'],
      },
      {
        code: 'media/Device',
        name: '视频设备',
        owner: 'iot',
        //parentId: '2',
        //id: '2-3',
        sortIndex: 3,
        url: '/media/device',
        icon: 'icon-shipinwangguan',
        showPage: ['media-device'],
        permissions: [
          { permission: 'file', actions: ['upload-static'] },
          { permission: 'media-record', actions: ['record', 'query', 'sync'] },
          { permission: 'device-gateway', actions: ['query', 'save', 'delete'] },
          {
            permission: 'gb28181-cascade',
            actions: ['bind', 'unbind', 'enable', 'disable', 'query', 'save', 'delete'],
          },
          { permission: 'media-channel', actions: ['query', 'save', 'delete'] },
          { permission: 'device-product', actions: ['query', 'save', 'delete'] },
          {
            permission: 'media-device',
            actions: ['stop', 'ptz', 'record', 'query', 'start', 'save', 'delete'],
          },
          {
            permission: 'media-gateway',
            actions: ['enable', 'disable', 'query', 'save', 'delete'],
          },
        ],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [{ permission: 'media-device', actions: ['query'] }],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'media-device', actions: ['delete'] }],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              { permission: 'file', actions: ['upload-static'] },
              { permission: 'device-gateway', actions: ['query'] },
              {
                permission: 'media-device',
                actions: ['stop', 'ptz', 'record', 'query', 'start', 'save'],
              },
              { permission: 'media-channel', actions: ['query', 'save'] },
              { permission: 'gb28181-cascade', actions: ['bind', 'unbind', 'query', 'save'] },
              { permission: 'device-product', actions: ['query'] },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              { permission: 'file', actions: ['upload-static'] },
              { permission: 'device-gateway', actions: ['query'] },
              { permission: 'media-device', actions: ['query', 'save'] },
              { permission: 'device-product', actions: ['query'] },
            ],
          },
        ],
      },
      {
        code: 'media/SplitScreen',
        name: '分屏展示',
        owner: 'iot',
        //parentId: '2',
        //id: '2-4',
        sortIndex: 4,
        url: '/media/SplitScreen',
        icon: 'icon-fenpingzhanshi1',
        showPage: ['media-device'],
        permissions: [
          {
            permission: 'media-device',
            actions: ['stop', 'ptz', 'record', 'query', 'start', 'save', 'delete'],
          },
          { permission: 'media-channel', actions: ['query', 'save', 'delete'] },
        ],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [{ permission: 'media-device', actions: ['query'] }],
          },
        ],
      },
      {
        code: 'media/Cascade',
        name: '国标级联',
        owner: 'iot',
        //parentId: '2',
        //id: '2-5',
        sortIndex: 5,
        url: '/media/Cascade',
        icon: 'icon-guojijilian',
        showPage: ['gb28181-cascade'],
        permissions: [
          {
            permission: 'gb28181-cascade',
            actions: ['bind', 'unbind', 'enable', 'disable', 'query', 'save', 'delete'],
          },
        ],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [{ permission: 'gb28181-cascade', actions: ['query'] }],
          },
          {
            id: 'action',
            name: '启/禁用',
            permissions: [
              { permission: 'gb28181-cascade', actions: ['enable', 'disable', 'query', 'save'] },
            ],
          },
          {
            id: 'push',
            name: '推送',
            permissions: [
              { permission: 'media-channel', actions: ['query'] },
              { permission: 'gb28181-cascade', actions: ['query'] },
            ],
          },
          {
            id: 'channel',
            name: '选择通道',
            permissions: [
              { permission: 'media-device', actions: ['query'] },
              { permission: 'media-channel', actions: ['query'] },
              { permission: 'gb28181-cascade', actions: ['bind', 'unbind', 'query', 'save'] },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              { permission: 'gb28181-cascade', actions: ['delete'] },
              { permission: 'media-server', actions: ['delete'] },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              { permission: 'gb28181-cascade', actions: ['query', 'save'] },
              { permission: 'media-server', actions: ['save'] },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [{ permission: 'gb28181-cascade', actions: ['query', 'save'] }],
          },
        ],
      },
    ],
  },

  // 系统管理
  {
    code: 'system',
    name: '系统管理',
    owner: 'iot',
    //id: '3',
    url: '/system',
    icon: 'icon-xitongguanli1',
    sortIndex: 3,
    permissions: [],
    buttons: [],
    children: [
      {
        code: 'system/Basis',
        name: '基础配置',
        owner: 'iot',
        //parentId: '3',
        //id: '3-1',
        sortIndex: 1,
        url: '/system/Basis',
        icon: 'icon-shezhi',
        showPage: ['system_config'],
        permissions: [],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'system_config',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'update',
            name: '保存',
            permissions: [
              {
                permission: 'system_config',
                actions: ['query', 'save'],
              },
              {
                permission: 'file',
                actions: ['upload-static'],
              },
            ],
          },
        ],
      },
      {
        code: 'system/User',
        name: '用户管理',
        owner: 'iot',
        //parentId: '3',
        //id: '3-2',
        sortIndex: 2,
        url: '/system/user',
        icon: 'icon-yonghuguanli',
        showPage: ['user'],
        permissions: [],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'user',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'action',
            name: '启/禁用',
            permissions: [
              {
                permission: 'user',
                actions: ['query', 'save', 'update-self-info'],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'user',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'user',
                actions: ['query', 'save', 'update-self-info', 'update-self-pwd'],
              },
              {
                permission: 'role',
                actions: ['query'],
              },
              {
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'organization',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'user',
                actions: ['query', 'save'],
              },
              {
                permission: 'role',
                actions: ['query'],
              },
              {
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'organization',
                actions: ['query'],
              },
            ],
          },
        ],
      },
      {
        code: 'system/Department',
        name: '组织管理',
        owner: 'iot',
        //parentId: '3',
        //id: '3-3',
        sortIndex: 3,
        url: '/system/Department',
        icon: 'icon-bumenguanli',
        showPage: ['organization'],
        permissions: [],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'organization',
                actions: ['query'],
              },
              {
                permission: 'user',
                actions: ['query'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
              {
                permission: 'assets-bind',
                actions: ['query'],
              },
            ],
          },
          // {
          //   id: 'edit',
          //   name: '资产编辑',
          //   permissions: [
          //     {
          //       permission: 'assets-bind',
          //       actions: ['query', 'permission'],
          //     },
          //     {
          //       permission: 'user',
          //       actions: ['query'],
          //     },
          //     {
          //       permission: 'device-product',
          //       actions: ['query'],
          //     },
          //     {
          //       permission: 'device-instance',
          //       actions: ['query'],
          //     },
          //   ],
          // },
          // {
          //   id: 'bind',
          //   name: '资产解绑',
          //   permissions: [
          //     {
          //       permission: 'assets-bind',
          //       actions: ['unbind', 'query'],
          //     },
          //     {
          //       permission: 'user',
          //       actions: ['query'],
          //     },
          //     {
          //       permission: 'device-product',
          //       actions: ['query'],
          //     },
          //     {
          //       permission: 'device-instance',
          //       actions: ['query'],
          //     },
          //     {
          //       permission: 'organization',
          //       actions: ['unbind-user'],
          //     },
          //   ],
          // },
          {
            id: 'bind-user',
            name: '绑定用户',
            permissions: [
              {
                permission: 'organization',
                actions: ['unbind-user', 'query', 'bind-user'],
              },
              {
                permission: 'user',
                actions: ['query'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
              {
                permission: 'assets-bind',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'assert',
            name: '资产分配',
            permissions: [
              {
                permission: 'assets-bind',
                actions: ['bind', 'unbind', 'query', 'permission'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-category',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
              {
                permission: 'user',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'organization',
                actions: ['delete'],
              },
              {
                permission: 'user',
                actions: ['query'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
              {
                permission: 'assets-bind',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'organization',
                actions: ['query', 'save'],
              },
              {
                permission: 'user',
                actions: ['query'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
              {
                permission: 'assets-bind',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'organization',
                actions: ['query', 'save'],
              },
              {
                permission: 'user',
                actions: ['query'],
              },
              {
                permission: 'device-product',
                actions: ['query'],
              },
              {
                permission: 'device-instance',
                actions: ['query'],
              },
              {
                permission: 'assets-bind',
                actions: ['query'],
              },
            ],
          },
        ],
      },
      {
        code: 'system/Role',
        name: '角色管理',
        owner: 'iot',
        //parentId: '3',
        //id: '3-4',
        sortIndex: 4,
        url: '/system/Role',
        icon: 'icon-jiaoseguanli',
        showPage: ['role'],
        permissions: [],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'role',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'role',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'role',
                actions: ['query', 'save'],
              },
              {
                permission: 'menu',
                actions: ['query', 'grant'],
              },
              {
                permission: 'user',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'role',
                actions: ['query', 'save'],
              },
              {
                permission: 'menu',
                actions: ['query', 'grant'],
              },
              {
                permission: 'user',
                actions: ['query'],
              },
            ],
          },
        ],
      },
      {
        code: 'system/Menu',
        name: '菜单管理',
        owner: 'iot',
        //parentId: '3',
        //id: '3-5',
        sortIndex: 5,
        url: '/system/Menu',
        icon: 'icon-caidanguanli',
        showPage: ['menu'],
        permissions: [],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'menu',
                actions: ['query'],
              },
              {
                permission: 'permission',
                actions: ['query'],
              },
            ],
          },
          // 超管才具备该权限
          // {
          //   id: 'setting',
          //   name: '配置',
          //   permissions: [
          //     {
          //       permission: 'menu',
          //       actions: ['query', 'save', 'grant'],
          //     },
          //   ],
          // },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'assets-bind',
                actions: ['bind', 'unbind', 'query', 'permission'],
              },
              {
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'menu',
                actions: ['query', 'save', 'grant'],
              },
              {
                permission: 'permission',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'menu',
                actions: ['query', 'grant', 'delete'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'assets-bind',
                actions: ['bind', 'unbind', 'query', 'permission'],
              },
              {
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'menu',
                actions: ['query', 'save', 'grant'],
              },
              {
                permission: 'permission',
                actions: ['query'],
              },
            ],
          },
        ],
      },
      {
        code: 'system/Permission',
        name: '权限管理',
        owner: 'iot',
        //parentId: '3',
        //id: '3-6',
        sortIndex: 6,
        url: '/system/Permission',
        icon: 'icon-quanxianguanli',
        showPage: ['permission'],
        permissions: [],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'permission',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'action',
            name: '启/禁用',
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'export',
            name: '导出',
            permissions: [
              {
                permission: 'permission',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'import',
            name: '导入',
            permissions: [
              {
                permission: 'file',
                actions: ['upload-static'],
              },
              {
                permission: 'permission',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'save', 'grant'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'permission',
                actions: ['query', 'save', 'grant'],
              },
            ],
          },
        ],
      },
      // {
      //   code: 'system/Platforms',
      //   name: '第三方平台',
      //   owner: 'iot',
      //   //parentId: '3',
      //   //id: '3-7',
      //   sortIndex: 7,
      //   url: '/system/platforms',
      //   icon: 'icon-xitongguanli1',
      //   permissions: [{ permission: 'open-api', actions: ['query', 'save', 'delete'] }],
      //   buttons: [
      //     {
      //       id: 'empowerment',
      //       name: '赋权',
      //       permissions: [
      //         { permission: 'user-third-party-manager', actions: ['save'] },
      //         { permission: 'open-api', actions: ['save'] },
      //       ],
      //     },
      //     {
      //       id: 'password',
      //       name: '重置密码',
      //       permissions: [{ permission: 'open-api', actions: ['save'] }],
      //     },
      //     {
      //       id: 'delete',
      //       name: '删除',
      //       permissions: [{ permission: 'open-api', actions: ['delete'] }],
      //     },
      //     {
      //       id: 'update',
      //       name: '编辑',
      //       permissions: [{ permission: 'open-api', actions: ['save'] }],
      //     },
      //     { id: 'add', name: '新增', permissions: [{ permission: 'open-api', actions: ['save'] }] },
      //   ],
      // },
      {
        code: 'system/Relationship',
        name: '关系配置',
        owner: 'iot',
        //parentId: '3',
        //id: '3-8',
        sortIndex: 8,
        url: '/system/Relationship',
        icon: 'icon-shuxingpeizhi',
        showPage: ['relation'],
        permissions: [],
        buttons: [
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'relation',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'relation',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'relation',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'relation',
                actions: ['query', 'save'],
              },
            ],
          },
        ],
      },
      {
        code: 'system/DataSource',
        name: '数据源管理',
        owner: 'iot',
        //parentId: '3',
        //id: '3-9',
        sortIndex: 9,
        url: '/system/DataSource',
        icon: 'icon-shebei',
        showPage: ['datasource-config'],
        permissions: [],
        buttons: [
          {
            id: 'manage',
            name: '管理',
            permissions: [
              {
                permission: 'datasource-config',
                actions: [
                  'query',
                  'del-mongodb-collection',
                  'save',
                  'rdb-ddl',
                  'create-mongodb-collection',
                ],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'datasource-config',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'action',
            name: '启用/禁用',
            permissions: [
              {
                permission: 'datasource-config',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'datasource-config',
                actions: [
                  'query',
                  'del-mongodb-collection',
                  'save',
                  'rdb-ddl',
                  'create-mongodb-collection',
                ],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'datasource-config',
                actions: [
                  'query',
                  'del-mongodb-collection',
                  'save',
                  'rdb-ddl',
                  'create-mongodb-collection',
                ],
              },
            ],
          },
        ],
      },
      {
        code: 'system/Platforms/Setting',
        name: 'API配置',
        owner: 'iot',
        //parentId: '3',
        //id: '3-10',
        sortIndex: 10,
        url: '/system/Api',
        icon: 'icon-chakanAPI',
        showPage: ['open-api'],
        permissions: [{ permission: 'open-api', actions: ['query', 'save'] }],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'open-api',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'open-api',
                actions: ['query', 'save'],
              },
            ],
          },
        ],
      },
      {
        code: 'system/Apply',
        name: '应用管理',
        owner: 'iot',
        //parentId: '3',
        //id: '3-11',
        sortIndex: 11,
        url: '/system/Apply',
        icon: 'icon-yingyongguanli',
        showPage: ['application'],
        permissions: [],
        buttons: [
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'application',
                actions: ['query', 'delete'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'menu',
                actions: ['query'],
              },
              {
                permission: 'application',
                actions: ['query', 'save'],
              },
              {
                permission: 'role',
                actions: ['query'],
              },
              {
                permission: 'open-api',
                actions: ['query', 'save', 'delete'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'menu',
                actions: ['query'],
              },
              {
                permission: 'application',
                actions: ['query', 'save'],
              },
              {
                permission: 'role',
                actions: ['query'],
              },
              {
                permission: 'open-api',
                actions: ['query', 'save', 'delete'],
              },
            ],
          },
          {
            id: 'empowerment',
            name: '赋权',
            permissions: [
              {
                permission: 'open-api',
                actions: ['query', 'save', 'delete'],
              },
            ],
          },
          {
            id: 'api',
            name: '查看api',
            permissions: [
              {
                permission: 'open-api',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'application',
                actions: ['query'],
              },
              {
                permission: 'role',
                actions: ['query'],
              },
            ],
          },
          {
            id: 'action',
            name: '启/禁用',
            permissions: [
              {
                permission: 'application',
                actions: ['save'],
              },
            ],
          },
        ],
      },
      {
        code: 'system/License',
        name: 'License管理',
        owner: 'iot',
        //parentId: '3',
        //id: '3-12',
        sortIndex: 12,
        url: '/system/License',
        icon: 'icon-zidingyiguize',
        showPage: ['license'],
        permissions: [
          {
            permission: 'license',
            actions: ['query', 'save'],
          },
        ],
        buttons: [
          {
            id: 'update',
            name: '编辑',
            description: null,
            permissions: [
              {
                permission: 'license',
                actions: ['query', 'save'],
              },
            ],
            options: null,
          },

          {
            id: 'view',
            name: '查看',
            description: null,
            permissions: [
              {
                permission: 'license"',
                actions: ['query'],
              },
            ],
            options: null,
          },
        ],
      },
    ],
  },
  //物联卡
  {
    path: '5Hpl',
    sortIndex: 4,
    level: 1,
    owner: 'iot',
    name: '物联卡',
    code: 'iot-card',
    url: '/iot-card',
    icon: 'icon-wulianka',
    permissions: [],
    children: [
      {
        path: '5Hpl-mghg',
        sortIndex: 1,
        level: 1,
        owner: 'iot',
        name: '首页',
        code: 'iot-card/Home',
        url: '/iot-card/Home',
        icon: 'icon-zhihuishequ',
        status: 1,
        showPage: ['network-flow'],
        permissions: [{ permission: 'network-flow', actions: ['query'] }],
        accessSupport: {
          text: '不支持',
          value: 'unsupported',
        },
      },
      {
        path: '5Hpl-4VFS',
        sortIndex: 2,
        level: 1,
        owner: 'iot',
        name: '仪表盘',
        code: 'iot-card/Dashboard',
        url: '/iot-card/Dashboard',
        icon: 'icon-keshihua',
        showPage: ['network-flow'],
        permissions: [{ permission: 'network-flow', actions: ['query'] }],
      },
      {
        path: '5Hpl-O2m8',
        sortIndex: 3,
        level: 2,
        owner: 'iot',
        name: '物联卡管理',
        code: 'iot-card/CardManagement',
        url: '/iot-card/CardManagement',
        icon: 'icon-wuliankaguanli',
        status: 1,
        showPage: ['network-card'],
        permissions: [
          {
            permission: 'network-card',
            actions: ['query', 'save', 'delete'],
          },
        ],
        buttons: [
          {
            id: 'sync',
            name: '同步',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['sync'],
              },
            ],
          },
          {
            id: 'import',
            name: '导入',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['import'],
              },
            ],
          },
          {
            id: 'export',
            name: '导出',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['export'],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['delete'],
              },
            ],
          },
          {
            id: 'active',
            name: '激活',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['active'],
              },
            ],
          },
          {
            id: 'bind',
            name: '绑定',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['action'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'action',
            name: '启/禁用',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'IotCard-management',
                actions: ['query'],
              },
            ],
          },
        ],
      },
      {
        path: '5Hpl-ZjAG',
        sortIndex: 4,
        level: 2,
        owner: 'iot',
        name: '充值管理',
        showPage: ['network-card'],
        code: 'iot-card/Recharge',
        url: '/iot-card/Recharge',
        icon: 'icon-chongzhiguanli',
        status: 1,
        permissions: [
          {
            permission: 'network-card',
            actions: ['query', 'save'],
          },
        ],
        buttons: [
          {
            id: 'pay',
            name: '充值',
            permissions: [
              {
                permission: 'network-card',
                actions: ['query', 'save'],
              },
            ],
          },
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'network-card',
                actions: ['query'],
              },
            ],
          },
        ],
      },
      {
        path: '5Hpl-eS9h',
        sortIndex: 5,
        level: 2,
        owner: 'iot',
        name: '平台接入',
        code: 'iot-card/Platform',
        url: '/iot-card/Platform',
        icon: 'icon-pingtaiduijie',
        status: 1,
        showPage: ['platform'],
        permissions: [
          {
            permission: 'platform',
            actions: ['save', 'delete', 'query'],
          },
        ],
        buttons: [
          {
            id: 'action',
            name: '启/禁用',
            permissions: [
              {
                permission: 'platform',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [
              {
                permission: 'platform',
                actions: ['delete'],
              },
            ],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'platform',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              {
                permission: 'platform',
                actions: ['save'],
              },
            ],
          },
          {
            id: 'view',
            name: '查看',
            permissions: [
              {
                permission: 'platform',
                actions: ['query'],
              },
            ],
          },
        ],
      },
      {
        path: '5Hpl-cL34',
        sortIndex: 6,
        level: 1,
        owner: 'iot',
        name: '操作记录',
        code: 'iot-card/Record',
        url: '/iot-card/Record',
        icon: 'icon-tongzhijilu',
        status: 1,
        showPage: ['network-card'],
        permissions: [
          {
            permission: 'network-card',
            actions: ['query'],
          },
        ],
      },
    ],
  },
];
