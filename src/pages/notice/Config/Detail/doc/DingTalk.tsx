import { Image } from 'antd';
import './index.less';

const DingTalk = () => {
  const appKey = require('/public/images/notice/doc/config/dingTalk-message/01-AppKey.jpg');
  const appSecret = require('/public/images/notice/doc/config/dingTalk-message/02-AppSecret.jpg');
  return (
    <div className={'doc'}>
      <div className={'url'}>
        钉钉管理后台：
        <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://open-dev.dingtalk.com
        </a>
      </div>
      <h1>1. 概述</h1>
      <div>
        通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
      </div>
      <h1>2.通知配置说明</h1>
      <div>
        <h2>1、AppKey</h2>
        <div>
          企业内部应用的唯一身份标识。在钉钉开发者后台创建企业内部应用后，系统会自动生成一对AppKey和AppSecret。
        </div>
        <div>获取路径：“钉钉开放平台”--“应用开发”--“应用信息”</div>
        <div className={'image'}>
          <Image width="100%" src={appKey} />
        </div>
      </div>
      <h2>2、AppSecret</h2>
      <div>
        <div>钉钉应用对应的调用密钥</div>
        <div>获取路径：“钉钉开放平台”--“应用开发”--“应用信息”</div>
        <div className={'image'}>
          <Image width="100%" src={appSecret} />
        </div>
      </div>
    </div>
  );
};
export default DingTalk;
