const getBaseUrl = (url:string) => {
    let BASE_URL = '';
    if (process.env.NODE_ENV === 'development') {
        //开发环境 - 根据请求不同返回不同的BASE_URL
        if (url.includes('/jetlinks/')) {
          BASE_URL = 'https://demo.jetlinks.cn'
        } else if (url.includes('/iatadatabase/')) {
          BASE_URL = 'https://demo.jetlinks.cn'
        }
      } else {
        // 生产环境
        // if (url.includes('/jetlinks/')) {
        //   BASE_URL = ''
        // } else if (url.includes('/iatadatabase/')) {
        //   BASE_URL = ''
        // }
      }
      return BASE_URL
}
export default getBaseUrl;