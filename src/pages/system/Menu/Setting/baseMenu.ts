export default [
  // 物联网
  {
    code: 'iot',
    name: '物联网',
    id: '1',
    url: '/iot',
    icon: 'icon-wulianwang',
    permissions: [
      {
        actions: ['query', 'save', 'delete'],
        permission: 'role',
      },
    ],
    children: [
      {
        code: 'home',
        name: '首页',
        parentId: '1',
        id: '1-1',
        url: '/iot/home',
        icon: 'icon-keshihua',
        permissions: [
          { permission: 'device-instance', actions: ['query'] },
          { permission: 'dashboard', actions: ['query'] },
          { permission: 'device-product', actions: ['query'] },
        ],
      },
      {
        code: 'notice',
        name: '通知管理',
        parentId: '1',
        id: '1-2',
        url: '/iot/notice/Type',
        icon: 'icon-shebei',
        permissions: [
          { permission: 'template', actions: ['query', 'save', 'delete'] },
          { permission: 'user-third-party-manager', actions: ['query', 'save'] },
          { permission: 'notifier', actions: ['query', 'save', 'delete', 'send'] },
          { permission: 'file', actions: ['upload-static'] },
        ],
        buttons: [
          { id: 'bind', name: '同步用户', enabled: false, granted: true },
          { id: 'view', name: '查看', enabled: false, granted: true },
          { id: 'log', name: '通知记录', enabled: false, granted: true },
          { id: 'debug', name: '调试', enabled: false, granted: true },
          { id: 'export', name: '导出', enabled: false, granted: true },
          { id: 'import', name: '导入', enabled: false, granted: true },
          { id: 'delete', name: '删除', enabled: false, granted: true },
          { id: 'update', name: '编辑', enabled: false, granted: true },
          { id: 'add', name: '新增', enabled: false, granted: true },
        ],
      },
      {
        code: 'device',
        name: '设备管理',
        parentId: '1',
        id: '1-3',
        url: '/iot/device',
        icon: 'icon-shebei',
        permissions: [],
        children: [
          {
            code: 'device/DashBoard',
            name: '仪表盘',
            parentId: '1-3',
            id: '1-3-1',
            url: '/iot/device/DashBoard',
            icon: 'icon-keshihua',
            permissions: [
              { permission: 'device-product', actions: ['query'] },
              { permission: 'dashboard', actions: ['query'] },
              { permission: 'device-instance', actions: ['query'] },
              { permission: 'geo-manager', actions: ['find-geo'] },
            ],
          },
          {
            code: 'device/Product',
            name: '产品',
            parentId: '1-3',
            id: '1-3-2',
            url: '/iot/device/Product',
            icon: 'icon-chanpin',
            permissions: [
              { permission: 'device-mapping', actions: ['query', 'save'] },
              { permission: 'device-gateway', actions: ['query', 'save', 'delete'] },
              { permission: 'device-product', actions: ['query', 'save', 'delete'] },
              {
                permission: 'protocol-supports',
                actions: ['enable', 'disable', 'query', 'save', 'delete'],
              },
              { permission: 'network-config', actions: ['query', 'save', 'action', 'delete'] },
              { permission: 'file', actions: ['upload-static'] },
              { permission: 'device-category', actions: ['query', 'save', 'delete'] },
              { permission: 'transparent-codec', actions: ['query', 'save'] },
              { permission: 'device-instance', actions: ['query', 'save', 'delete'] },
            ],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'device-product', actions: ['query'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  { permission: 'protocol-supports', actions: ['query'] },
                  { permission: 'file', actions: ['upload-static'] },
                  { permission: 'device-gateway', actions: ['query'] },
                  { permission: 'device-mapping', actions: ['query', 'save'] },
                  { permission: 'device-instance', actions: ['query'] },
                  { permission: 'device-product', actions: ['save'] },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [{ permission: 'device-product', actions: ['query', 'save'] }],
              },
              {
                id: 'export',
                name: '导出',
                permissions: [{ permission: 'device-product', actions: ['query'] }],
              },
              {
                id: 'import',
                name: '导入',
                permissions: [
                  { permission: 'file', actions: ['upload-static'] },
                  { permission: 'device-product', actions: ['query', 'save'] },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'device-product', actions: ['delete'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  { permission: 'file', actions: ['upload-static'] },
                  { permission: 'device-product', actions: ['query', 'save'] },
                ],
              },
            ],
          },
          {
            code: 'device/Instance',
            name: '设备',
            parentId: '1-3',
            id: '1-3-3',
            url: '/iot/device/Instance',
            icon: 'icon-shebei',
            permissions: [
              { permission: 'transparent-codec', actions: ['query'] },
              { permission: 'device-api', actions: ['query-device-events'] },
            ],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'device-instance', actions: ['query'] }],
              },
              {
                id: 'export',
                name: '导出',
                permissions: [{ permission: 'device-instance', actions: ['query'] }],
              },
              {
                id: 'import',
                name: '导入',
                permissions: [
                  { permission: 'file', actions: ['upload-static'] },
                  { permission: 'device-instance', actions: ['query', 'save'] },
                  { permission: 'device-product', actions: ['query'] },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  { permission: 'file', actions: ['upload-static'] },
                  { permission: 'visualization', actions: ['query'] },
                  { permission: 'organization', actions: ['query'] },
                  {
                    permission: 'device-opt-api',
                    actions: ['read-property', 'invoke-function', 'write-property'],
                  },
                  { permission: 'device-gateway', actions: ['query'] },
                  { permission: 'dictionary', actions: ['query'] },
                  { permission: 'device-category', actions: ['query'] },
                  { permission: 'device-mapping', actions: ['query', 'save'] },
                  { permission: 'device-instance', actions: ['query', 'save'] },
                  { permission: 'device-product', actions: ['query'] },
                  { permission: 'media-server', actions: ['query'] },
                  { permission: 'dashboard', actions: ['query'] },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [{ permission: 'device-instance', actions: ['query', 'save'] }],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'device-instance', actions: ['delete'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  { permission: 'file', actions: ['upload-static'] },
                  { permission: 'device-instance', actions: ['query', 'save'] },
                  { permission: 'device-product', actions: ['query'] },
                ],
              },
            ],
          },
          {
            code: 'device/Category',
            name: '产品分类',
            parentId: '1-3',
            id: '1-3-4',
            url: '/iot/device/Category',
            icon: 'icon-chanpinfenlei1',
            permissions: [{ permission: 'device-category', actions: ['query', 'save'] }],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'device-category', actions: ['query'] }],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'device-category', actions: ['delete'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'device-category', actions: ['query', 'save'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'device-category', actions: ['query', 'save'] }],
              },
            ],
          },
        ],
      },

      {
        code: 'link',
        name: '运维管理',
        parentId: '1',
        id: '1-4',
        url: '/iot/link',
        icon: 'icon-yunweiguanli-1',
        permissions: [],
        children: [
          {
            code: 'link/DashBoard',
            name: '仪表盘',
            parentId: '1-4',
            id: '1-4-1',
            url: '/iot/link/dashboard',
            icon: 'icon-keshihua',
            permissions: [
              { permission: 'network-config', actions: ['query'] },
              { permission: 'dashboard', actions: ['query'] },
            ],
          },
          {
            code: 'link/AccessConfig',
            name: '设备接入网关',
            parentId: '1-4',
            id: '1-4-2',
            url: '/iot/link/accessConfig',
            icon: 'icon-wangguanzishebei',
            permissions: [
              { permission: 'device-gateway', actions: ['query', 'save', 'delete'] },
              { permission: 'opc-point', actions: ['query', 'save', 'delete'] },
              {
                permission: 'protocol-supports',
                actions: ['enable', 'disable', 'query', 'save', 'delete'],
              },
              {
                permission: 'gb28181-cascade',
                actions: ['bind', 'unbind', 'enable', 'disable', 'query', 'save', 'delete'],
              },
              { permission: 'opc-device-bind', actions: ['query', 'save', 'delete'] },
              { permission: 'network-config', actions: ['query', 'save', 'action', 'delete'] },
              { permission: 'opc-client', actions: ['query', 'save', 'delete'] },
            ],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'device-gateway', actions: ['query'] }],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'device-gateway', actions: ['delete'] }],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [{ permission: 'device-gateway', actions: ['query', 'save'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  { permission: 'protocol-supports', actions: ['query'] },
                  { permission: 'opc-point', actions: ['query'] },
                  { permission: 'network-config', actions: ['query'] },
                  { permission: 'device-gateway', actions: ['query', 'save'] },
                  { permission: 'opc-client', actions: ['query', 'save', 'delete'] },
                  { permission: 'opc-device-bind', actions: ['query', 'save', 'delete'] },
                  { permission: 'gb28181-cascade', actions: ['query'] },
                ],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  { permission: 'protocol-supports', actions: ['query'] },
                  { permission: 'opc-point', actions: ['query'] },
                  { permission: 'certificate', actions: ['query'] },
                  { permission: 'network-config', actions: ['query'] },
                  { permission: 'media-gateway', actions: ['query'] },
                  { permission: 'device-gateway', actions: ['query', 'save'] },
                  { permission: 'opc-client', actions: ['query'] },
                  { permission: 'opc-device-bind', actions: ['query'] },
                  { permission: 'gb28181-cascade', actions: ['query'] },
                ],
              },
            ],
          },
          {
            code: 'link/Protocol',
            name: '协议管理',
            parentId: '1-4',
            id: '1-4-3',
            url: '/iot/link/protocol',
            icon: 'icon-tongzhiguanli',
            permissions: [
              {
                permission: 'protocol-supports',
                actions: ['enable', 'disable', 'query', 'save', 'delete'],
              },
              { permission: 'file', actions: ['upload-static'] },
            ],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'protocol-supports', actions: ['query'] }],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  {
                    permission: 'protocol-supports',
                    actions: ['enable', 'disable', 'query', 'save'],
                  },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'protocol-supports', actions: ['delete'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  { permission: 'protocol-supports', actions: ['query', 'save'] },
                  { permission: 'file', actions: ['upload-static'] },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  { permission: 'protocol-supports', actions: ['query', 'save'] },
                  { permission: 'file', actions: ['upload-static'] },
                ],
              },
            ],
          },
          {
            code: 'Log',
            name: '日志管理',
            parentId: '1-4',
            id: '1-4-4',
            url: '/iot/link/Log',
            icon: 'icon-rizhifuwu',
            permissions: [
              { permission: 'system-logger', actions: ['query'] },
              { permission: 'access-logger', actions: ['self-data', 'query'] },
            ],
            buttions: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  { permission: 'system-logger', actions: ['query'] },
                  { permission: 'access-logger', actions: ['query'] },
                ],
              },
            ],
          },
          {
            code: 'link/Type',
            name: '网络组件',
            parentId: '1-4',
            id: '1-4-5',
            url: '/iot/link/type',
            icon: 'icon-wangluozujian',
            permissions: [{ permission: 'network-config', actions: ['query', 'delete'] }],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'network-config', actions: ['query'] }],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  { permission: 'network-config', actions: ['query', 'save', 'action'] },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'network-config', actions: ['delete'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'network-config', actions: ['query', 'save'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'network-config', actions: ['query', 'save'] }],
              },
            ],
          },
          {
            code: 'link/Certificate',
            name: '证书管理',
            parentId: '1-4',
            id: '1-4-6',
            url: '/iot/link/Certificate',
            icon: 'icon-rizhifuwu',
            permissions: [],
            buttons: [
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'certificate', actions: ['delete'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'certificate', actions: ['save'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'certificate', actions: ['save'] }],
              },
            ],
          },
          {
            code: 'media/Stream',
            name: '流媒体服务',
            parentId: '1-4',
            id: '1-4-7',
            url: '/iot/link/Stream',
            icon: 'icon-xuanzetongdao1',
            permissions: [{ permission: 'media-server', actions: ['query', 'save', 'delete'] }],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'media-gateway', actions: ['query'] }],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'media-server', actions: ['delete'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'media-server', actions: ['query', 'save'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'media-server', actions: ['query', 'save'] }],
              },
            ],
          },
          {
            code: 'link/Channel',
            name: '通道配置',
            parentId: '1-4',
            id: '1-4-8',
            url: '/iot/link/Channel',
            icon: 'icon-zidingyiguize',
            permissions: [],
            children: [
              {
                code: 'link/Channel/Opcua',
                name: 'OPC UA',
                parentId: '1-4-8',
                id: '1-4-8-1',
                url: '/iot/link/Channel/Opcua',
                icon: 'icon-zhilianshebei',
                permissions: [
                  { permission: 'opc-device-bind', actions: ['query'] },
                  { permission: 'opc-point', actions: ['query'] },
                  { permission: 'opc-client', actions: ['query'] },
                ],
                buttons: [
                  {
                    id: 'view',
                    name: '设备接入',
                    permissions: [
                      { permission: 'opc-point', actions: ['query'] },
                      { permission: 'opc-device-bind', actions: ['query'] },
                      { permission: 'opc-client', actions: ['query'] },
                    ],
                  },
                  {
                    id: 'action',
                    name: '启/禁用',
                    permissions: [
                      { permission: 'opc-point', actions: ['query', 'save'] },
                      { permission: 'opc-client', actions: ['query', 'save'] },
                    ],
                  },
                  {
                    id: 'update',
                    name: '编辑',
                    permissions: [
                      { permission: 'opc-point', actions: ['query', 'save'] },
                      { permission: 'opc-device-bind', actions: ['query', 'save'] },
                      { permission: 'opc-client', actions: ['query', 'save'] },
                    ],
                  },
                  {
                    id: 'delete',
                    name: '删除',
                    permissions: [
                      { permission: 'opc-point', actions: ['query', 'delete'] },
                      { permission: 'opc-device-bind', actions: ['query', 'delete'] },
                      { permission: 'opc-client', actions: ['query', 'delete'] },
                    ],
                  },
                  {
                    id: 'add',
                    name: '新增',
                    permissions: [
                      { permission: 'opc-point', actions: ['query', 'save'] },
                      { permission: 'opc-device-bind', actions: ['query', 'save'] },
                      { permission: 'opc-client', actions: ['query', 'save'] },
                    ],
                  },
                ],
              },
              {
                code: 'link/Channel/Modbus',
                name: 'Modbus',
                parentId: '1-4-8',
                id: '1-4-8-2',
                url: '/iot/link/Channel/Modbus',
                icon: 'icon-changjingliandong',
                permissions: [],
                buttons: [
                  {
                    id: 'update',
                    name: '编辑',
                    permissions: [{ permission: 'modbus-master', actions: ['query', 'save'] }],
                  },
                  {
                    id: 'action',
                    name: '启/禁用',
                    permissions: [{ permission: 'modbus-master', actions: ['query', 'save'] }],
                  },
                  {
                    id: 'view',
                    name: '设备接入',
                    permissions: [{ permission: 'modbus-master', actions: ['query', 'save'] }],
                  },
                  {
                    id: 'delete',
                    name: '删除',
                    permissions: [{ permission: 'modbus-master', actions: ['query', 'delete'] }],
                  },
                  {
                    id: 'add',
                    name: '新增',
                    permissions: [{ permission: 'modbus-master', actions: ['query', 'save'] }],
                  },
                ],
              },
            ],
          },
          {
            code: 'device/Firmware',
            name: '远程升级',
            parentId: '1-4',
            id: '1-4-9',
            url: '/iot/link/firmware',
            icon: 'icon-wangluozujian',
            permissions: [
              { permission: 'firmware-manager', actions: ['query', 'save', 'delete'] },
              {
                permission: 'firmware-upgrade-task-manager',
                actions: ['query', 'save', 'delete', 'deploy'],
              },
              { permission: 'device-product', actions: ['query'] },
              { permission: 'device-api', actions: ['query'] },
            ],
            buttons: [
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'firmware-upgrade-task-manager', actions: ['save'] }],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [{ permission: 'firmware-upgrade-task-manager', actions: ['deploy'] }],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'firmware-upgrade-task-manager', actions: ['delete'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'firmware-upgrade-task-manager', actions: ['save'] }],
              },
            ],
          },
        ],
      },

      {
        code: 'rule-engine/Alarm',
        name: '告警中心',
        parentId: '1',
        id: '1-5',
        url: '/iot/Alarm',
        icon: 'icon-zidingyiguize',
        permissions: [],
        buttons: [],
        children: [
          {
            code: 'rule-engine/DashBoard',
            name: '仪表盘',
            parentId: '1-5',
            id: '1-5-1',
            url: '/iot/Alarm/dashboard',
            icon: 'icon-shujumoni',
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
            parentId: '1-5',
            id: '1-5-3',
            url: '/iot/Alarm/Config',
            icon: 'icon-chajianguanli',
            permissions: [{ permission: 'alarm-config', actions: ['query', 'save', 'delete'] }],
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
            parentId: '1-5',
            id: '1-5-2',
            url: '/iot/Alarm/Configuration',
            icon: 'icon-chajianguanli',
            permissions: [
              { permission: 'rule-scene', actions: ['query', 'execute'] },
              { permission: 'alarm-config', actions: ['query', 'save', 'delete'] },
            ],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'alarm-config', actions: ['query'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'alarm-config', actions: ['query', 'save'] }],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [{ permission: 'alarm-config', actions: ['query', 'save'] }],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'alarm-config', actions: ['query', 'delete'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'alarm-config', actions: ['query', 'save'] }],
              },
              {
                id: 'tigger',
                name: '手动触发',
                permissions: [
                  { permission: 'rule-scene', actions: ['execute'] },
                  { permission: 'alarm-config', actions: ['query'] },
                ],
              },
            ],
          },
          {
            code: 'rule-engine/Alarm/Log',
            name: '告警记录',
            parentId: '1-5',
            id: '1-5-4',
            url: '/iot/Alarm/Log',
            icon: 'icon-changjingliandong',
            permissions: [{ permission: 'alarm-record', actions: ['query', 'save'] }],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [{ permission: 'alarm-record', actions: ['query'] }],
              },
              {
                id: 'action',
                name: '告警处理',
                permissions: [{ permission: 'alarm-record', actions: ['query'] }],
              },
            ],
          },
        ],
      },

      {
        code: 'Northbound',
        name: '北向输出',
        parentId: '1',
        id: '1-6',
        url: '/iot/northbound',
        icon: 'icon-yunyunjieru',
        permissions: [],
        buttons: [],
        children: [
          {
            code: 'Northbound/DuerOS',
            name: 'DuerOS',
            parentId: '1-6',
            id: '1-6-1',
            url: '/iot/northbound/DuerOS',
            icon: 'icon-yunyunjieru',
            permissions: [],
            buttons: [
              {
                id: 'action',
                name: '状态切换',
                permissions: [{ permission: 'dueros-product', actions: ['query', 'save'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'dueros-product', actions: ['query', 'save'] }],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'dueros-product', actions: ['query', 'delete'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [
                  { permission: 'dueros-product', actions: ['query', 'save', 'delete'] },
                ],
              },
            ],
          },
          {
            code: 'Northbound/AliCloud',
            name: '阿里云',
            parentId: '1-6',
            id: '1-6-2',
            url: '/iot/northbound/AliCloud',
            icon: 'icon-yunyunjieru',
            permissions: [],
            buttons: [
              {
                id: 'action',
                name: '启用/禁用',
                permissions: [{ permission: 'aliyun-bridge', actions: ['query', 'save'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'aliyun-bridge', actions: ['query', 'save'] }],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'aliyun-bridge', actions: ['query', 'delete'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'aliyun-bridge', actions: ['query', 'save'] }],
              },
            ],
          },
        ],
      },

      {
        code: 'rule-engine',
        name: '规则引擎',
        parentId: '1',
        id: '1-7',
        url: '/iot/rule-engine',
        icon: 'icon-zidingyiguize',
        permissions: [],
        buttons: [],
        children: [
          {
            code: 'rule-engine/Instance',
            name: '规则编排',
            parentId: '1-7',
            id: '1-7-1',
            url: '/iot/rule-engine/Instance',
            icon: 'icon-changjingliandong',
            permissions: [
              {
                permission: 'rule-instance',
                actions: ['stop', 'query', 'start', 'save', 'delete', 'execute'],
              },
              { permission: 'rule-model', actions: ['query', 'save', 'delete', 'deploy'] },
            ],
            buttons: [
              {
                id: 'view',
                name: '查看',
                permissions: [
                  { permission: 'rule-instance', actions: ['query'] },
                  { permission: 'rule-model', actions: ['query'] },
                ],
              },
              {
                id: 'action',
                name: '启/禁用',
                permissions: [
                  { permission: 'rule-instance', actions: ['stop', 'query', 'start', 'save'] },
                  { permission: 'rule-model', actions: ['query', 'deploy'] },
                ],
              },
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'rule-instance', actions: ['delete'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [
                  { permission: 'rule-instance', actions: ['query', 'save', 'execute'] },
                  { permission: 'rule-model', actions: ['query', 'save', 'delete', 'deploy'] },
                ],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'rule-instance', actions: ['query', 'save'] }],
              },
            ],
          },
          {
            code: 'rule-engine/Scene',
            name: '场景联动',
            parentId: '1-7',
            id: '1-7-2',
            url: '/iot/rule-engine/scene',
            icon: 'icon-yunweiguanli-1',
            permissions: [{ permission: 'rule-scene', actions: ['query', 'save', 'delete'] }],
            buttons: [
              {
                id: 'delete',
                name: '删除',
                permissions: [{ permission: 'rule-scene', actions: ['query', 'delete'] }],
              },
              {
                id: 'action',
                name: '启用/禁用',
                permissions: [{ permission: 'rule-scene', actions: ['query', 'save', 'execute'] }],
              },
              {
                id: 'add',
                name: '新增',
                permissions: [{ permission: 'rule-scene', actions: ['query', 'save', 'execute'] }],
              },
              {
                id: 'update',
                name: '编辑',
                permissions: [{ permission: 'rule-scene', actions: ['query', 'save', 'execute'] }],
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
    id: '2',
    url: '/media',
    icon: 'icon-shipinwangguan',
    permissions: [],
    buttons: [],
    children: [
      {
        code: 'media/Home',
        name: '首页',
        parentId: '2',
        id: '2-1',
        url: '/media/home',
        icon: 'icon-zhihuishequ',
        permissions: [],
        buttons: [],
      },
      {
        code: 'media/DashBoard',
        name: '仪表盘',
        parentId: '2',
        id: '2-2',
        url: '/media/dashboard',
        icon: 'icon-keshihua',
        permissions: [],
        buttons: [],
      },
      {
        code: 'media/Device',
        name: '视频设备',
        parentId: '2',
        id: '2-3',
        url: '/media/device',
        icon: 'icon-keshihua',
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
        parentId: '2',
        id: '2-4',
        url: '/media/SplitScreen',
        icon: 'icon-fenpingzhanshi1',
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
        parentId: '2',
        id: '2-5',
        url: '/media/Cascade',
        icon: 'icon-guojijilian',
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
    id: '3',
    url: '/system',
    icon: 'icon-xitongguanli1',
    permissions: [{ permission: 'menu', actions: ['query', 'save', 'grant', 'delete'] }],
    buttons: [],
    children: [
      {
        code: 'system/Basis',
        name: '基础配置',
        parentId: '3',
        id: '3-1',
        url: '/system/Basis',
        icon: 'icon-shezhi',
        permissions: [
          { permission: 'file', actions: ['upload-static'] },
          { permission: 'system_config', actions: ['query', 'save'] },
        ],
        buttons: [
          {
            id: 'update',
            name: '保存',
            permissions: [{ permission: 'system-config', actions: ['save'] }],
          },
        ],
      },
      {
        code: 'system/User',
        name: '用户管理',
        parentId: '3',
        id: '3-2',
        url: '/system/user',
        icon: 'icon-yonghuguanli',
        permissions: [
          { permission: 'role', actions: ['query', 'save', 'delete'] },
          { permission: 'file', actions: ['upload-static'] },
          {
            permission: 'organization',
            actions: ['unbind-user', 'query', 'save', 'bind-user', 'delete'],
          },
          {
            permission: 'user',
            actions: ['query', 'save', 'update-self-info', 'update-self-pwd', 'delete'],
          },
        ],
        buttons: [
          { id: 'view', name: '查看', permissions: [{ permission: 'user', actions: ['query'] }] },
          {
            id: 'action',
            name: '启/禁用',
            permissions: [{ permission: 'user', actions: ['query', 'save', 'update-self-info'] }],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'user', actions: ['delete'] }],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              {
                permission: 'user',
                actions: ['query', 'save', 'update-self-info', 'update-self-pwd'],
              },
              { permission: 'role', actions: ['query'] },
              { permission: 'file', actions: ['upload-static'] },
              { permission: 'organization', actions: ['query'] },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              { permission: 'user', actions: ['query', 'save'] },
              { permission: 'role', actions: ['query'] },
              { permission: 'file', actions: ['upload-static'] },
              { permission: 'organization', actions: ['query'] },
            ],
          },
        ],
      },
      {
        code: 'system/Department',
        name: '部门管理',
        parentId: '3',
        id: '3-3',
        url: '/system/Department',
        icon: 'icon-bumenguanli',
        permissions: [
          {
            id: 'view',
            name: '查看',
            permissions: [{ permission: 'organization', actions: ['query'] }],
          },
          {
            id: 'bind-user',
            name: '绑定用户',
            permissions: [
              { permission: 'user', actions: ['query'] },
              { permission: 'organization', actions: ['unbind-user', 'query', 'bind-user'] },
            ],
          },
          {
            id: 'assert',
            name: '分配资产',
            permissions: [
              { permission: 'assets-bind', actions: ['bind', 'unbind', 'query', 'permission'] },
              { permission: 'device-category', actions: ['query'] },
              { permission: 'device-instance', actions: ['query'] },
              { permission: 'device-product', actions: ['query'] },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'organization', actions: ['delete'] }],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [{ permission: 'organization', actions: ['query', 'save'] }],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [{ permission: 'organization', actions: ['query', 'save'] }],
          },
        ],
        buttons: [
          { permission: 'assets-bind', actions: ['bind', 'unbind', 'query', 'permission'] },
          { permission: 'role', actions: ['query', 'save', 'delete'] },
          { permission: 'device-category', actions: ['query', 'save', 'delete'] },
          { permission: 'device-instance', actions: ['query', 'save', 'delete'] },
          {
            permission: 'user',
            actions: ['query', 'save', 'update-self-info', 'update-self-pwd', 'delete'],
          },
          { permission: 'device-product', actions: ['query', 'save', 'delete'] },
        ],
      },
      {
        code: 'system/Role',
        name: '角色管理',
        parentId: '3',
        id: '3-4',
        url: '/system/Role',
        icon: 'icon-jiaoseguanli',
        permissions: [
          {
            permission: 'user',
            actions: ['query', 'save', 'update-self-info', 'update-self-pwd', 'delete'],
          },
          { permission: 'dimension', actions: ['query', 'save', 'delete'] },
          { permission: 'role', actions: ['query', 'save', 'delete'] },
          {
            permission: 'permission',
            actions: ['enable', 'disable', 'query', 'save', 'grant', 'delete'],
          },
          { permission: 'autz-setting', actions: ['query', 'save', 'delete'] },
        ],
        buttons: [
          { id: 'view', name: '查看', permissions: [{ permission: 'role', actions: ['query'] }] },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'role', actions: ['delete'] }],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              { permission: 'role', actions: ['query', 'save'] },
              { permission: 'menu', actions: ['query'] },
            ],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [{ permission: 'role', actions: ['query', 'save'] }],
          },
        ],
      },
      {
        code: 'system/Menu',
        name: '菜单管理',
        parentId: '3',
        id: '3-5',
        url: '/system/Menu',
        icon: 'icon-caidanguanli',
        permissions: [
          { permission: 'dimension', actions: ['query', 'save', 'delete'] },
          { permission: 'menu', actions: ['query', 'save', 'grant', 'delete'] },
          { permission: 'assets-bind', actions: ['bind', 'unbind', 'query', 'permission'] },
          { permission: 'file', actions: ['upload-static'] },
          {
            permission: 'permission',
            actions: ['enable', 'disable', 'query', 'save', 'grant', 'delete'],
          },
          { permission: 'autz-setting', actions: ['query', 'save', 'delete'] },
        ],
        buttons: [
          { id: 'view', name: '查看', permissions: [{ permission: 'menu', actions: ['query'] }] },
          {
            id: 'setting',
            name: '配置',
            permissions: [{ permission: 'menu', actions: ['query', 'save', 'grant'] }],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [
              { permission: 'assets-bind', actions: ['bind', 'unbind', 'query', 'permission'] },
              { permission: 'file', actions: ['upload-static'] },
              { permission: 'menu', actions: ['query', 'save', 'grant'] },
              { permission: 'permission', actions: ['query'] },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'menu', actions: ['delete'] }],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [
              { permission: 'assets-bind', actions: ['bind', 'unbind', 'query', 'permission'] },
              { permission: 'file', actions: ['upload-static'] },
              { permission: 'menu', actions: ['query', 'save', 'grant'] },
              { permission: 'permission', actions: ['query'] },
            ],
          },
        ],
      },
      {
        code: 'system/Permission',
        name: '权限管理',
        parentId: '3',
        id: '3-6',
        url: '/system/Permission',
        icon: 'icon-quanxianguanli',
        permissions: [
          {
            permission: 'permission',
            actions: ['enable', 'disable', 'query', 'save', 'grant', 'delete'],
          },
        ],
        buttons: [
          {
            id: 'view',
            name: '查看',
            permissions: [{ permission: 'permission', actions: ['query'] }],
          },
          {
            id: 'action',
            name: '启/禁用',
            permissions: [{ permission: 'permission', actions: ['enable', 'disable', 'save'] }],
          },
          {
            id: 'export',
            name: '导出',
            permissions: [{ permission: 'permission', actions: ['query'] }],
          },
          {
            id: 'import',
            name: '导入',
            permissions: [
              { permission: 'file', actions: ['upload-static'] },
              { permission: 'permission', actions: ['query', 'save'] },
            ],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'permission', actions: ['delete'] }],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [{ permission: 'permission', actions: ['query', 'save', 'grant'] }],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [{ permission: 'permission', actions: ['query', 'save', 'grant'] }],
          },
        ],
      },
      {
        code: 'system/Platforms',
        name: '第三方平台',
        parentId: '3',
        id: '3-7',
        url: '/system/platforms',
        icon: 'icon-xitongguanli1',
        permissions: [{ permission: 'open-api', actions: ['query', 'save', 'delete'] }],
        buttons: [
          {
            id: 'empowerment',
            name: '赋权',
            permissions: [{ permission: 'user-third-party-manager', actions: ['save'] }],
          },
          {
            id: 'action',
            name: '重置密码',
            permissions: [{ permission: 'open-api', actions: ['save'] }],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'open-api', actions: ['delete'] }],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [{ permission: 'open-api', actions: ['save'] }],
          },
          { id: 'add', name: '新增', permissions: [{ permission: 'open-api', actions: ['save'] }] },
        ],
      },
      {
        code: 'system/Relationship',
        name: '关系配置',
        parentId: '3',
        id: '3-8',
        url: '/system/Relationship',
        icon: 'icon-renyuan',
        permissions: [{ permission: 'relation', actions: ['query', 'save', 'delete'] }],
        buttons: [
          {
            id: 'update',
            name: '编辑',
            permissions: [{ permission: 'relation', actions: ['query', 'save'] }],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'relation', actions: ['delete'] }],
          },
          {
            id: 'view',
            name: '查看',
            permissions: [{ permission: 'relation', actions: ['query'] }],
          },
          { id: 'add', name: '新增', permissions: [{ permission: 'relation', actions: ['save'] }] },
        ],
      },
      {
        code: 'system/DataSource',
        name: '数据源管理',
        parentId: '3',
        id: '3-9',
        url: '/system/DataSource',
        icon: 'icon-shebei',
        permissions: [],
        buttons: [
          {
            id: 'manage',
            name: '管理',
            permissions: [{ permission: 'datasource-config', actions: ['rdb-ddl'] }],
          },
          {
            id: 'delete',
            name: '删除',
            permissions: [{ permission: 'datasource-config', actions: ['delete'] }],
          },
          {
            id: 'action',
            name: '启用/禁用',
            permissions: [{ permission: 'datasource-config', actions: ['save'] }],
          },
          {
            id: 'update',
            name: '编辑',
            permissions: [{ permission: 'datasource-config', actions: ['query', 'save'] }],
          },
          {
            id: 'add',
            name: '新增',
            permissions: [{ permission: 'datasource-config', actions: ['save'] }],
          },
        ],
      },
      {
        code: 'system/Platforms/Setting',
        name: 'API配置',
        parentId: '3',
        id: '3-10',
        url: '/system/Api',
        icon: 'icon-rizhifuwu',
        permissions: [{ permission: 'open-api', actions: ['query'] }],
        buttons: [],
      },
    ],
  },
];
