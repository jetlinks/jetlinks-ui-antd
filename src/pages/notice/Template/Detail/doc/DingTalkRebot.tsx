const DingTalkRebot = () => {
  const b = '{name}';
  return (
    <div>
      <div
        style={{
          backgroundColor: '#e9eaeb',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        钉钉管理后台：<a href="https://www.dingtalk.com">https://www.dingtalk.com</a>
      </div>
      <b>1. 概述</b>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
      </div>
      <b>2.模板配置说明</b>
      <div>
        <div> 1、绑定配置</div>
        <div> 绑定通知配置</div>
        <div> 2、消息类型</div>
        <div> 目前支持text、markdown、link3种。</div>
        <div> 3. 模板内容</div>
        <div>
          支持填写带变量的动态模板。变量填写规范示例：${b}
          。填写动态参数后，可对变量的名称、类型、格式进行配置，以便告警通知时填写。
        </div>
      </div>
    </div>
  );
};
export default DingTalkRebot;
