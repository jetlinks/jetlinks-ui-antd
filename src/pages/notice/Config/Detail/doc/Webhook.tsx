import './index.less';

const Webhook = () => {
  return (
    <div className={'doc'}>
      <h1>1. 概述</h1>
      <div>
        webhook是一个接收HTTP请求的URL（本平台默认只支持HTTP
        POST请求），实现了Webhook的第三方系统可以基于该URL订阅本平台系统信息，本平台按配置把特定的事件结果推送到指定的地址，便于系统做后续处理。
      </div>
      <h1>2.通知配置说明</h1>
      <h2>1、Webhook</h2>
      <div>Webhook地址。</div>

      <h2>2、请求头</h2>
      <div>支持根据系统提供的接口设置不同的请求头。如 Accept-Language 、Content-Type</div>
    </div>
  );
};
export default Webhook;
