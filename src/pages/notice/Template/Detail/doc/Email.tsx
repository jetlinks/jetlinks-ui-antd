import './index.less';

const Email = () => {
  const a = '{标题}';
  const b = '{name}';
  return (
    <div className="doc">
      <h1>1. 概述</h1>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
        服务器地址支持自定义输入。
      </div>
      <h1>2.模板配置说明</h1>
      <div>
        <h2> 1、服务器地址</h2>
        <div>服务器地址支持自定义输入</div>
        <h2> 2、标题</h2>
        <div>支持输入变量，变量格式${a}</div>
        <h2> 3、收件人</h2>
        <div> 支持录入多个邮箱地址，可填写变量参数。</div>
        <h2> 4、模板内容</h2>
        <div>
          支持填写带变量的动态模板。变量填写规范示例：${b}
          。填写动态参数后，可对变量的名称、类型、格式进行配置，以便告警通知时填写。
        </div>
      </div>
    </div>
  );
};
export default Email;
