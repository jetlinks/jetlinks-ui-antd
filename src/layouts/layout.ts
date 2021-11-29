import { reactive } from 'vue'
import { getFrontConfig, updateFrontConfig } from '@/apis/layout'

export type Option = {
  splitMenus: boolean;
  title: string;
  titleIcon: string;
  navTheme: 'light' | 'dark';
  layout: string;
  fixSiderbar: boolean;
  primaryColor: string;
  get: () => void;
  menuData: any[];
  update: (current: any) => void;
}
export const layoutState = reactive<Option>({
  splitMenus: true,
  title: 'Jetlinks',
  titleIcon: 'http://demo.jetlinks.cn/jetlinks/upload/20210608/1402207767988912128.png',
  navTheme: 'dark',
  layout: 'side',
  fixSiderbar: true,
  primaryColor: '#1890ff',
  menuData: [],
  get () {
    getFrontConfig().then(resp => {
      if (resp.data.status === 200) {
        const data = { ...resp.data.result }
        this.titleIcon = data.titleIcon
        this.navTheme = data.navTheme
        this.fixSiderbar = data.fixSiderbar
        this.title = data.title
        this.primaryColor = data.primaryColor
      }
    })
  },
  update (data: any) {
    updateFrontConfig(data).then(resp => {
      if (resp.data.status === 200) {
        this.get()
      }
    })
  }
})
