import './index.less';

const Webhook = () => {
  return (
    <div className="doc">
      <h1>1. 概述</h1>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
      </div>
      <h1>2.模板配置说明</h1>
      <div>
        1、请求体 请求体中的数据来自于发送通知时指定的所有变量,也可通过自定义的方式进行变量配置。
        使用webhook通知时，系统会将该事件通过您指定的URL地址，以POST方式发送。
      </div>
    </div>
  );
};
export default Webhook;
