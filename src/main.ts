import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Antd from 'ant-design-vue'
import icons from '@/utils/icons.ts'
import moment from 'moment'
import 'ant-design-vue/dist/antd.css'
import '@ant-design-vue/pro-layout/dist/style.css'
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout'

const app = createApp(App as any)
app.config.globalProperties.$axios = axios
app.config.globalProperties.$moment = moment
app.use(store)
app.use(router)
app.use(Antd)
app.use(icons)
app.use(ProLayout)
app.use(PageContainer)
app.mount('#app')
