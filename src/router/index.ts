import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import RouteView from '@/layouts/RouteView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'Layout',
    meta: { title: '首页' },
    component: BasicLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        meta: { title: '统计分析', icon: 'FundOutlined' },
        component: () => import(/* webpackChunkName: "about" */ '@/views/pages/home/index.vue')
      },
      {
        path: '/system',
        name: 'system',
        meta: { title: '系统设置', icon: 'SettingOutlined' },
        redirect: '/system/user',
        component: RouteView,
        children: [
          {
            path: 'user',
            name: 'user',
            meta: { title: '用户管理', icon: 'UserOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/system/user/index.vue')
          },
          {
            path: 'permission',
            name: 'permission',
            meta: { title: '权限管理', icon: 'KeyOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/system/permission/index.vue')
          },
          {
            path: 'open-api',
            name: 'open-api',
            meta: { title: '第三方平台', icon: 'ApiOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/system/open-api/index.vue')
          },
          {
            path: 'org',
            name: 'org',
            meta: { title: '机构管理', icon: 'ApartmentOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/system/org/index.vue')
          },
          {
            path: 'role',
            name: 'role',
            meta: { title: '角色管理', icon: 'UsergroupAddOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/system/role/index.vue')
          },
          {
            path: 'config',
            name: 'config',
            meta: { title: '系统配置', icon: 'ToolOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/system/config/index.vue')
          },
          {
            path: 'tenant',
            name: 'tenant',
            meta: { title: '租户管理', icon: 'TeamOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/system/tenant/index.vue')
          },
          {
            path: 'datasource',
            name: 'datasource',
            meta: { title: '数据源管理', icon: 'DatabaseOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/system/datasource/index.vue')
          }
        ]
      },
      {
        path: '/device',
        name: 'device',
        meta: { title: '设备管理', icon: 'BoxPlotOutlined' },
        redirect: '/device/product',
        component: RouteView,
        children: [
          {
            path: 'product',
            name: 'product',
            meta: { title: '产品管理', icon: 'LaptopOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/product/index.vue')
          },
          {
            path: 'product/:id',
            meta: { title: '产品详情' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/product/detail/index.vue'),
            props: true
          },
          {
            path: 'category',
            name: 'category',
            meta: { title: '产品分类', icon: 'AppstoreOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/category/index.vue')
          },
          {
            path: 'instance',
            name: 'instance',
            meta: { title: '设备管理', icon: 'DesktopOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/instance/index.vue')
          },
          {
            path: 'tree',
            name: 'tree',
            meta: { title: '分组管理', icon: 'OrderedListOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/tree/index.vue')
          },
          {
            path: 'device-gateway',
            name: 'device-gateway',
            meta: { title: '网关管理', icon: 'DeploymentUnitOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/gateway/index.vue')
          },
          {
            path: 'location',
            name: 'location',
            meta: { title: '地理位置', icon: 'CompassOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/location/index.vue')
          },
          {
            path: 'firmware',
            name: 'firmware',
            meta: { title: '固件升级', icon: 'ArrowUpOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/firmware/index.vue')
          },
          {
            path: 'alarm',
            name: 'alarm',
            meta: { title: '设备告警', icon: 'ExclamationOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/alarmLog/index.vue')
          },
          {
            path: 'command',
            name: 'command',
            meta: { title: '指令下发', icon: 'MacCommandOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/device/command/index.vue')
          }
        ]
      },
      {
        path: '/links',
        name: 'links',
        meta: { title: '设备接入', icon: 'LinkOutlined' },
        redirect: '/links/certificate',
        component: RouteView,
        children: [
          {
            path: 'certificate',
            name: 'certificate',
            meta: { title: '证书管理', icon: 'BookOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/links/certificate/index.vue')
          },
          {
            path: 'protocol',
            name: 'protocol',
            meta: { title: '协议管理', icon: 'WalletOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/links/protocol/index.vue')
          },
          {
            path: 'network',
            name: 'network',
            meta: { title: '组件管理', icon: 'ApartmentOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/links/network/index.vue')
          },
          {
            path: 'gateway',
            name: 'gateway',
            meta: { title: '设备网关', icon: 'GatewayOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/links/gateway/index.vue')
          },
          {
            path: 'opc-ua',
            name: 'opc-ua',
            meta: { title: 'OPC UA', icon: 'FilePptOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/links/opc-ua/index.vue')
          }
        ]
      },
      {
        path: '/notice',
        name: 'notice',
        meta: { title: '通知管理', icon: 'FileMarkdownOutlined' },
        redirect: '/notice/config',
        component: RouteView,
        children: [
          {
            path: 'notice-config',
            name: 'notice-config',
            meta: { title: '通知配置', icon: 'MailOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/notice/config/index.vue')
          },
          {
            path: 'template',
            name: 'template',
            meta: { title: '通知模板', icon: 'BellOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/notice/template/index.vue')
          }
        ]
      },
      {
        path: '/rule-engine',
        name: 'rule-engine',
        meta: { title: '规则引擎', icon: 'NodeIndexOutlined' },
        redirect: '/rule-engine/rule-instance',
        component: RouteView,
        children: [
          {
            path: 'rule-instance',
            name: 'rule-instance',
            meta: { title: '规则实例', icon: 'BlockOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/rule-engine/instance/index.vue')
          },
          {
            path: 'sql-rule',
            name: 'sql-rule',
            meta: { title: '数据转发', icon: 'ConsoleSqlOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/rule-engine/sql-rule/index.vue')
          },
          {
            path: 'scene',
            name: 'scene',
            meta: { title: '场景联动', icon: 'ShareAltOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/rule-engine/scene/index.vue')
          }
        ]
      },
      {
        path: '/visualization',
        name: 'visualization',
        meta: { title: '可视化', icon: 'EyeOutlined' },
        redirect: '/visualization/screen',
        component: RouteView,
        children: [
          {
            path: 'screen',
            name: 'screen',
            meta: { title: '大屏管理', icon: 'FundViewOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/visualization/screen/index.vue')
          }
        ]
      },
      {
        path: '/simulator',
        name: 'simulator',
        meta: { title: '模拟测试', icon: 'BugOutlined' },
        redirect: '/simulator/device-emulator',
        component: RouteView,
        children: [
          {
            path: 'device-emulator',
            name: 'device-emulator',
            meta: { title: '设备模拟器', icon: 'PaperClipOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/simulator/device/index.vue')
          }
        ]
      },
      {
        path: '/log',
        name: 'log',
        meta: { title: '日志管理', icon: 'CalendarOutlined' },
        redirect: '/log/access',
        component: RouteView,
        children: [
          {
            path: 'access',
            name: 'access',
            meta: { title: '访问日志', icon: 'EllipsisOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/log/access/index.vue')
          },
          {
            path: 'system-log',
            name: 'system-log',
            meta: { title: '系统日志', icon: 'ExceptionOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/log/system/index.vue')
          }
        ]
      },
      {
        path: '/cloud',
        name: 'cloud',
        meta: { title: '云云对接', icon: 'CloudOutlined' },
        redirect: '/cloud/dueros',
        component: RouteView,
        children: [
          {
            path: 'dueros',
            name: 'dueros',
            meta: { title: 'DoerOS', icon: 'CloudServerOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/cloud/dueros/index.vue')
          },
          {
            path: 'aliyun',
            name: 'aliyun',
            meta: { title: '阿里云', icon: 'AliyunOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/cloud/aliyun/index.vue')
          },
          {
            path: 'onenet',
            name: 'onenet',
            meta: { title: '移动OneNet', icon: 'MobileOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/cloud/onenet/index.vue')
          },
          {
            path: 'ctwing',
            name: 'ctwing',
            meta: { title: '电信CTWing', icon: 'PhoneOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/cloud/ctwing/index.vue')
          }
        ]
      },
      {
        path: '/media',
        name: 'media',
        meta: { title: '视频网关', icon: 'VideoCameraAddOutlined' },
        redirect: '/media/basic',
        component: RouteView,
        children: [
          {
            path: 'basic',
            name: 'basic',
            meta: { title: '基础配置', icon: 'BarsOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/media/basic/index.vue')
          },
          {
            path: 'video',
            name: 'video',
            meta: { title: '视频设备', icon: 'VideoCameraOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/media/video/index.vue')
          },
          {
            path: 'reveal',
            name: 'reveal',
            meta: { title: '分屏展示', icon: 'TableOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/media/reveal/index.vue')
          },
          {
            path: 'cascade',
            name: 'cascade',
            meta: { title: '国标级联', icon: 'ClusterOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/media/cascade/index.vue')
          }
        ]
      },
      {
        path: '/edge',
        name: 'edge',
        meta: { title: '边缘网关', icon: 'ForkOutlined' },
        redirect: '/edge/edge-product',
        component: RouteView,
        children: [
          {
            path: 'edge-product',
            name: 'edge-product',
            meta: { title: '产品', icon: 'DatabaseOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/edge/product/index.vue')
          },
          {
            path: 'edge-device',
            name: 'edge-device',
            meta: { title: '设备', icon: 'LaptopOutlined' },
            component: () => import(/* webpackChunkName: "about" */ '@/views/pages/edge/device/index.vue')
          }
        ]
      }
      // {
      //   path: '/404',
      //   name: '404',
      //   meta: { title: '404' },
      //   component: () => import(/* webpackChunkName: "about" */ '@/views/pages/404.vue')
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
