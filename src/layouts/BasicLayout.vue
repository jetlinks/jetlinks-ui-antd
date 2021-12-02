<template>
  <pro-layout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="layoutState"
    :loading="loading"
    :breadcrumb="{ routes: breadcrumb }"
  >
    <template #menuHeaderRender>
      <a>
        <img :src="layoutState.titleIcon" />
        <h1>{{ layoutState.title }}</h1>
      </a>
    </template>
    <template #rightContentRender>
      <a-dropdown>
        <div style="display: flex; align-items: center; justify-content: center;">
          <div style="margin-right: 12px">
            <a-avatar size="small">
              <template #icon>
                <img :src="userDetail.avatar" />
              </template>
            </a-avatar>
          </div>
          <div>{{userDetail?.name}}</div>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item><SettingOutlined />个人设置</a-menu-item>
            <a-menu-item><LogoutOutlined />退出登录</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template #breadcrumbRender="{ route, params, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ route.breadcrumbName }}
      </span>
      <router-link v-else :to="{ path: route.path, params }">
        {{ route.breadcrumbName }}
      </router-link>
    </template>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </pro-layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue'
import { getMenuData, clearMenuItem } from '@ant-design-vue/pro-layout'
import type { RouteContextProps } from '@ant-design-vue/pro-layout'
import { layoutState } from './layout'
import { initWebSocket } from '@/utils/websocket'
const i18n = (t: string) => t
export default defineComponent({
  name: 'BasicLayout',
  components: {
    LogoutOutlined,
    SettingOutlined,
    UserOutlined
  },
  setup () {
    initWebSocket()
    const loading = ref(false)
    const userDetail = JSON.parse(localStorage.getItem('user-detail') || '{}')
    const router = useRouter()
    const { menuData } = getMenuData(clearMenuItem(router.getRoutes()))
    const baseState = reactive<Omit<RouteContextProps, 'menuData'>>({
      selectedKeys: [],
      openKeys: [],
      collapsed: false,
      primaryColor: '#1890ff'
    })
    const breadcrumb = computed(() =>
      router.currentRoute.value.matched.concat().map(item => {
        return {
          path: item.path,
          breadcrumbName: item.meta.title || ''
        }
      })
    )
    const handleCollapsed = () => {
      baseState.collapsed = !baseState.collapsed
    }
    watchEffect(() => {
      layoutState.menuData = menuData
      // 获取前端信息
      layoutState.get()
      if (router.currentRoute) {
        const matched = router.currentRoute.value.matched.concat()
        baseState.selectedKeys = matched.filter(r => r.name !== 'index').map(r => r.path)
        baseState.openKeys = matched
          .filter(r => r.path !== router.currentRoute.value.path)
          .map(r => r.path)
      }
    })
    return {
      i18n,
      userDetail,
      baseState,
      layoutState,
      loading,
      breadcrumb,
      handleCollapsed
    }
  }
})
</script>
