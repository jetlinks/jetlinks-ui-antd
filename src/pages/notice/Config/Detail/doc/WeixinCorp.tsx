import { Image } from 'antd';
import './index.less';

const WeixinCorp = () => {
  const corpId = require('/public/images/notice/doc/config/weixin-corp/01-corpId.jpg');
  const corpSecret = require('/public/images/notice/doc/config/weixin-corp/02-corpSecret.jpg');
  return (
    <div className={'doc'}>
      <div className={'url'}>
        企业微信管理后台：
        <a href="https://work.weixin.qq.com" target="_blank" rel="noopener noreferrer">
          https://work.weixin.qq.com
        </a>
      </div>
      <h1>1. 概述</h1>
      <div>
        通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
      </div>
      <h1>2.通知配置说明</h1>
      <div>
        <h2>1、corpId</h2>
        <div>企业号的唯一专属编号。</div>
        <div>获取路径：“企业微信”管理后台--“我的企业”--“企业ID”</div>
        <div className={'image'}>
          <Image width="100%" src={corpId} />
        </div>
      </div>

      <h2>2、corpSecret</h2>
      <div>
        <div>应用的唯一secret,一个企业微信中可以有多个corpSecret</div>
        <div>获取路径：“企业微信”--“应用与小程序”--“自建应用”中获取</div>
        <div className={'image'}>
          <Image width="100%" src={corpSecret} />
        </div>
      </div>
    </div>
  );
};
export default WeixinCorp;
