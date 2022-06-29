import { Image } from 'antd';
import './index.less';

const WeixinApp = () => {
  const appId = require('/public/images/notice/doc/template/weixin-official/02-mini-Program-Appid.png');

  return (
    <div className="doc">
      <div className="url">
        企业微信管理后台：
        <a href="https://work.weixin.qq.com" target="_blank" rel="noopener noreferrer">
          https://work.weixin.qq.com
        </a>
      </div>
      <h1>1. 概述</h1>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
      </div>
      <h1>2.模板配置说明</h1>
      <div>
        <h2>1、绑定配置</h2>
        <div>使用固定的通知配置发送此通知模板</div>
      </div>
      <div>
        <h2>2、用户标签</h2>
        <div>以标签的维度通知该标签下所有用户</div>
      </div>
      <div>
        <h2>3、消息模板</h2>
        <div>微信公众号中配置的消息模板</div>
      </div>
      <div>
        <h2>4、模板跳转链接</h2>
        <div>点击消息之后进行页面跳转</div>
      </div>
      <div>
        <h2>5、跳转小程序Appid</h2>
        <div>点击消息之后打开对应的小程序</div>
      </div>
      <div>
        <h2>6、跳转小程序具体路径</h2>
        <div>点击消息之后跳转到小程序的具体页面</div>
        <div className="image">
          <Image width="100%" src={appId} />
        </div>
      </div>
      <div>
        <h2>7、模板内容</h2>
        <div>
          支持填写带变量的动态模板。变量填写规范示例：${name}
          。填写动态参数后，可对变量的名称、类型、格式进行配置，以便告警通知时填写。
        </div>
      </div>
    </div>
  );
};
export default WeixinApp;
