import './index.less';

const DingTalkRebot = () => {
  const b = '{name}';
  return (
    <div className="doc">
      <div className="url">
        钉钉开放平台：
        <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://open-dev.dingtalk.com
        </a>
      </div>
      <h1>1. 概述</h1>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
      </div>
      <div>
        使用钉钉群机器人消息通知时需在钉钉开放平台中创建好对应的机器人，再到钉钉客户端在对应的群众绑定智能机器人。
      </div>
      <h1>2.模板配置说明</h1>
      <div>
        <h2> 1、绑定配置</h2>
        <div> 使用固定的通知配置发送此通知模板</div>
        <h2> 2、消息类型</h2>
        <div> 目前支持text、markdown、link3种。</div>
        <h2> 3、模板内容</h2>
        <div>
          支持填写带变量的动态模板。变量填写规范示例：${b}
          。填写动态参数后，可对变量的名称、类型、格式进行配置，以便告警通知时填写。
        </div>
      </div>
    </div>
  );
};
export default DingTalkRebot;
