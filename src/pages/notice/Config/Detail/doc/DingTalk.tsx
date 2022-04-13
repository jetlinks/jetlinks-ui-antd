const DingTalk = () => {
  const appKey = require('/public/images/notice/doc/config/dingTalk-message/01-AppKey.jpg');
  const appSecret = require('/public/images/notice/doc/config/dingTalk-message/02-AppSecret.jpg');
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
        钉钉管理后台：<a href="https://open-dev.dingtalk.com">https://open-dev.dingtalk.com</a>
      </div>
      <b>1. 概述</b>
      <div>
        通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
      </div>
      <b>2.通知配置说明</b>
      <div>
        <div>1. AppKey</div>
        <div>
          企业内部应用的唯一身份标识。在钉钉开发者后台创建企业内部应用后，系统会自动生成一对AppKey和AppSecret。
        </div>
        <div>获取路径：“钉钉开放平台”--“应用开发”--“应用信息”</div>
        <div>
          <img style={{ width: '100%' }} src={appKey} alt="appKey" />
        </div>
      </div>
      <b>2. AppSecret</b>
      <div>
        <div>钉钉应用对应的调用密钥</div>
        <div>获取路径：“钉钉开放平台”--“应用开发”--“应用信息”</div>
        <div>
          <img style={{ width: '100%' }} src={appSecret} alt="appSecret" />
        </div>
      </div>
    </div>
  );
};
export default DingTalk;
