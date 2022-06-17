import { Image } from 'antd';
import './index.less';

const AliyunSms = () => {
  const accessKey = require('/public/images/notice/doc/config/aliyun-sms-voice/AccesskeyIDSecret.jpg');
  return (
    <div className={'doc'}>
      <div className={'url'}>
        阿里云管理控制台：
        <a href="https://home.console.aliyun.com" target="_blank" rel="noopener noreferrer">
          https://home.console.aliyun.com
        </a>
      </div>
      <h1>1. 概述</h1>
      <div>
        通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
      </div>
      <h1>2.通知配置说明</h1>
      <div>
        <h2>1. RegionID</h2>
        <div>阿里云内部给每台机器设置的唯一编号。请根据购买的阿里云服务器地址进行填写。</div>
        <div>
          阿里云地域和可用区对照表地址：https://help.aliyun.com/document_detail/40654.html?spm=a2c6h.13066369.0.0.54a174710O7rWH
        </div>
      </div>
      <h2>2. AccesskeyID/Secret</h2>
      <div>
        <div>用于程序通知方式调用云服务费API的用户标识和秘钥</div>
        <div>获取路径：“阿里云管理控制台”--“用户头像”--“”--“AccessKey管理”--“查看”</div>
        <div className={'image'}>
          <Image width="100%" src={accessKey} />
        </div>
      </div>
    </div>
  );
};
export default AliyunSms;
