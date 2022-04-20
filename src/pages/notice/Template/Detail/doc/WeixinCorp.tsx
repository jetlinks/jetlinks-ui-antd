import { Image } from 'antd';
import './index.less';

const WeixinCorp = () => {
  const agentId = require('/public/images/notice/doc/template/weixin-corp/01-Agentid.jpg');
  const userId = require('/public/images/notice/doc/template/weixin-corp/02-userID.jpg');
  const toDept = require('/public/images/notice/doc/template/weixin-corp/03-toDept.jpg');
  const toTags = require('/public/images/notice/doc/template/weixin-corp/04-toTags.jpg');

  return (
    <div className="doc">
      <div className="url">
        企业微信管理后台：<a href="https://work.weixin.qq.com">https://work.weixin.qq.com</a>
      </div>
      <h1>1. 概述</h1>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
      </div>
      <h1>2.模版配置说明</h1>
      <div>
        <h2> 1、绑定配置</h2>
        <div> 绑定通知配置</div>
        <h2> 2. Agentid</h2>
        <div> 应用唯一标识</div>
        <div> 获取路径：“企业微信”管理后台--“应用管理”--“应用”--“查看应用”</div>
        <div className="image">
          <Image width="100%" src={agentId} />
        </div>
        <h2> 3. 收信人ID、收信部门ID、标签推送</h2>
        <div>
          接收通知的3种方式，3个字段若在此页面都没有填写，则在模板调试和配置告警通知时需要手动填写
        </div>
        <div> 收信人ID获取路径：【通讯录】-{'>'}【成员信息】查看成员账号</div>
        <div> 收信部门ID获取路径：【通讯录】-{'>'}【部门信息】查看部门ID</div>
        <div className="image">
          <Image width="100%" src={userId} />
          <Image width="100%" src={toDept} />
          <Image width="100%" src={toTags} />
        </div>
      </div>
    </div>
  );
};
export default WeixinCorp;
