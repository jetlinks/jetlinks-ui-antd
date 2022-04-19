import { Image } from 'antd';
import './index.less';

const DingTalk = () => {
  const agentId = require('/public/images/notice/doc/template/dingTalk-message/01-Agentid.jpg');
  const userId = require('/public/images/notice/doc/template/dingTalk-message/02-user-id.jpg');
  const dept = require('/public/images/notice/doc/template/dingTalk-message/03-dept.jpg');
  const a = '{name}';
  return (
    <div className="doc">
      <div className="url">
        钉钉开放平台：<a href="https://open-dev.dingtalk.com">https://open-dev.dingtalk.com</a>
        <br />
        钉钉管理后台：<a href="https://www.dingtalk.com">https://www.dingtalk.com</a>
      </div>
      <h1>1. 概述</h1>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
      </div>
      <h1> 2.模板配置说明</h1>
      <h2> 1、绑定配置</h2>
      <div> 绑定通知配置</div>
      <h2> 2. Agentid</h2>
      <div> 应用唯一标识</div>
      <div className="image">
        <Image width="100%" src={agentId} />
      </div>
      <div> 获取路径：“钉钉开发平台”--“应用开发”--“查看应用”</div>
      <h2> 3. 收信人ID、收信部门ID</h2>
      <div>
        接收通知的2种方式，2个字段若在此页面都没有填写，则在模板调试和配置告警通知时需要手动填写
      </div>
      <div> 收信人ID获取路径：“钉钉管理后台”--“通讯录”--“查看用户”</div>
      <div> 收信部门ID获取路径：“钉钉管理后台”--“通讯录”--“编辑部门”</div>
      <div className="image">
        <Image width="100%" src={userId} />
        <Image width="100%" src={dept} />
      </div>
      <h2> 4. 模板内容</h2>
      <div>
        支持填写带变量的动态模板。变量填写规范示例：${a}
        。填写动态参数后，可对变量的名称、类型、格式进行配置，以便告警通知时填写。
      </div>
    </div>
  );
};
export default DingTalk;
