export default {
  pages: [
    'pages/device/index',
    'pages/index/index',
    'pages/me/index',
  ],
  tabBar:{
    list:[{
      pagePath:'pages/index/index',
      text:'首页',
      selectedIconPath:'resource/all.png',
      iconPath:'resource/all.png'
    },{
      iconPath:'resource/list.png',
      selectedIconPath:'resource/list.png',
      pagePath:'pages/device/index',
      text:'设备'
    },{
      iconPath:'resource/vip.png',
      selectedIconPath:'resource/vip.png',
      pagePath:'pages/me/index',
      text:'我的'
    }],
    'color': '#000',
    'selectedColor': '#56abe4',
    'backgroundColor': '#fff',
    'borderStyle': 'white'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
