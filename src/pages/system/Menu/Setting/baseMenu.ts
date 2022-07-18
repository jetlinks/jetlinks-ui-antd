export default [
  // 物联网
  {
    code: 'iot',
    name: '物联网',
    id: '1',
    children: [
      { code: 'home', name: '首页', parentId: '1', id: '1-1' },
      { code: 'notice', name: '通知管理', parentId: '1', id: '1-2' },

      {
        code: 'device',
        name: '设备管理',
        parentId: '1',
        id: '1-3',
        children: [
          { code: 'device/DashBoard', name: '仪表盘', parentId: '1-3', id: '1-3-1' },
          { code: 'device/Product', name: '产品', parentId: '1-3', id: '1-3-2' },
          { code: 'device/Instance', name: '设备', parentId: '1-3', id: '1-3-3' },
          { code: 'device/Category', name: '产品分类', parentId: '1-3', id: '1-3-4' },
        ],
      },

      {
        code: 'link',
        name: '运维管理',
        parentId: '1',
        id: '1-4',
        children: [
          { code: 'link/DashBoard', name: '仪表盘', parentId: '1-4', id: '1-4-1' },
          { code: 'link/AccessConfig', name: '设备接入网关', parentId: '1-4', id: '1-4-2' },
          { code: 'link/Protocol', name: '协议管理', parentId: '1-4', id: '1-4-3' },
          { code: 'Log', name: '日志管理', parentId: '1-4', id: '1-4-4' },
          { code: 'link/Type', name: '网络组件', parentId: '1-4', id: '1-4-5' },
          { code: 'link/Certificate', name: '证书管理', parentId: '1-4', id: '1-4-6' },
          { code: 'media/Stream', name: '流媒体服务', parentId: '1-4', id: '1-4-7' },
          {
            code: 'link/Channel',
            name: '通道配置',
            parentId: '1-4',
            id: '1-4-8',
            children: [
              { code: 'link/Channel/Opcua', name: 'OPC UA', parentId: '1-4-8', id: '1-4-8-1' },
              { code: 'link/Channel/Modbus', name: 'Modbus', parentId: '1-4-8', id: '1-4-8-2' },
            ],
          },
        ],
      },

      {
        code: 'notice',
        name: '通知管理',
        parentId: '1',
        id: '1-5',
        children: [
          { code: 'rule-engine/Alarm', name: '告警中心', parentId: '1-5', id: '1-5-1' },
          { code: 'rule-engine/DashBoard', name: '仪表盘', parentId: '1-5', id: '1-5-2' },
          {
            code: 'rule-engine/Alarm/Configuration',
            name: '告警配置',
            parentId: '1-5',
            id: '1-5-3',
          },
          { code: 'rule-engine/Alarm/Config', name: '基础配置', parentId: '1-5', id: '1-5-4' },
          { code: 'rule-engine/Alarm/Log', name: '告警记录', parentId: '1-5', id: '1-5-5' },
        ],
      },

      {
        code: 'Northbound',
        name: '北向输出',
        parentId: '1',
        id: '1-6',
        children: [
          { code: 'Northbound/DuerOS', name: 'DuerOS', parentId: '1-6', id: '1-6-1' },
          { code: 'Northbound/AliCloud', name: '阿里云', parentId: '1-6', id: '1-6-2' },
        ],
      },

      {
        code: 'rule-engine',
        name: '规则引擎',
        parentId: '1',
        id: '1-7',
        children: [
          { code: 'rule-engine/Instance', name: '规则编排', parentId: '1-7', id: '1-7-1' },
          { code: 'rule-engine/Scene', name: '场景联动', parentId: '1-7', id: '1-7-2' },
        ],
      },
    ],
  },

  // 视频中心
  {
    code: 'media',
    name: '视频中心',
    id: '2',
    children: [
      { code: 'media/Home', name: '首页', parentId: '2', id: '2-1' },
      { code: 'media/DashBoard', name: '仪表盘', parentId: '2', id: '2-2' },
      { code: 'media/Device', name: '视频设备', parentId: '2', id: '2-3' },
      { code: 'media/SplitScreen', name: '分屏展示', parentId: '2', id: '2-4' },
      { code: 'media/Cascade', name: '国标级联', parentId: '2', id: '2-5' },
    ],
  },

  // 系统管理
  {
    code: 'system',
    name: '系统管理',
    id: '3',
    children: [
      { code: 'system/Basis', name: '基础配置', parentId: '3', id: '3-1' },
      { code: 'system/User', name: '用户管理', parentId: '3', id: '3-2' },
      { code: 'system/Department', name: '部门管理', parentId: '3', id: '3-3' },
      { code: 'system/Role', name: '角色管理', parentId: '3', id: '3-4' },
      { code: 'system/Menu', name: '菜单管理', parentId: '3', id: '3-5' },
      { code: 'system/Permission', name: '权限管理', parentId: '3', id: '3-6' },
      { code: 'system/Platforms', name: '第三方平台', parentId: '3', id: '3-7' },
      { code: 'system/Relationship', name: '关系配置', parentId: '3', id: '3-8' },
      { code: 'system/DataSource', name: '数据源管理', parentId: '3', id: '3-9' },
      { code: 'system/Platforms/Setting', name: 'API配置', parentId: '3', id: '3-10' },
    ],
  },
];
