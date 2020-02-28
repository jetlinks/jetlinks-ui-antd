使用

    $ git clone https://github.com/jetlinks/jetlinks-ui-antd.git
    $ cd jetlinks-ui-antd
    $ npm install
    $ npm start         # visit http://localhost:8000

本地开发环境要求

- nodeJs v12.14
- npm v6.13
- Chrome v80.0

本地开发项目建议使用如下命令启动项目

    $ npm run start:dev     //支持：dev、test、pre环境

项目多处采用了 SSE 接口交互，开发需要使用 dev 环境变量（生产环境使用 nginx 代理了 EventSource 接口）

修改后台接口地址

后台接口配置文件地址：config/proxy.ts:

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

注：本项目所有接口采用“/jetlinks”开头，用于统一代理

更多信息请参考 使用文档。

支持环境

现代浏览器及 IE11。

</br>IE / Edge </br>Firefox </br>Chrome </br>Safari </br>Opera  
 IE11, Edge last 2 versions last 2 versions last 2 versions last 2 versions

参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 😃：

- 在你的公司或个人项目中使用 Jetlinks。
- 通过 Issue 报告 bug 或进行咨询。
- 提交 Pull Request 改进 Pro 的代码。
