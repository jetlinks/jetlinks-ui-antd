## 使用

```bash
$ git clone https://github.com/jetlinks/jetlinks-ui-antd.git
$ cd jetlinks-ui-antd
$ npm install
$ npm start         # visit http://localhost:8000
```
>> 推荐使用淘宝镜像

### 本地开发环境要求

- nodeJs v12.x
- npm v6.x
- Chrome v80.0+

本地开发项目建议使用如下命令启动项目

```bash
$ npm run start:dev     //支持：dev、test、pre环境
```

项目多处采用了 SSE 接口交互，开发需要使用 dev 环境变量（生产环境使用 nginx 代理了 EventSource 接口）

### 修改后台接口地址

后台接口配置文件地址：`config/proxy.ts`:

```typescript
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 */
export default {
  dev: {
    '/jetlinks': {
      target: '后台地址',
      changeOrigin: true,
      pathRewrite: { '^/jetlinks': '' },
    },
  },
  test: {
    '/jetlinks': {
      target: '后台地址',
      changeOrigin: true,
      pathRewrite: { '^/jetlinks': '' },
    },
  },
  pre: {
    '/jetlinks': {
      target: '后台地址',
      changeOrigin: true,
      pathRewrite: { '^/jetlinks': '' },
    },
  },
};
```

> **注：本项目所有接口采用“/jetlinks”开头，用于统一代理**

更多信息请参考 [使用文档](http://doc.jetlinks.cn)。

## 支持环境

现代浏览器及 IE11。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| IE11, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 :smiley:：

- 在你的公司或个人项目中使用 Jetlinks。
- 通过 [Issue](https://github.com/jetlinks/jetlinks-ui-antd/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](https://github.com/jetlinks/jetlinks-ui-antd//pulls) 改进 Jetlinks 的代码。
