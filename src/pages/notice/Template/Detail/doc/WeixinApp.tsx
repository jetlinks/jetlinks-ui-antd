const WeixinApp = () => {
  const agentId = require('/public/images/notice/doc/template/weixin-official/01-Agentid.jpg');
  const appId = require('/public/images/notice/doc/template/weixin-official/02-mini-Program-Appid.jpg');

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
        微信公众平台：<a href="https://mp.weixin.qq.com/">https://mp.weixin.qq.com/</a>
      </div>
      <b>1. 概述</b>
      <div>
        通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
      </div>
      <b>2.通知配置说明</b>
      <div>
        <div>1. AppID</div>
        <div>微信服务号的唯一专属编号。</div>
        <div>获取路径：“微信公众平台”管理后台--“设置与开发”--“基本配置”</div>
        <div>
          <img style={{ width: '100%' }} src={agentId} alt="agentId" />
        </div>
      </div>
      <b>2. AppSecret</b>
      <div>
        <div>公众号开发者身份的密码</div>
        <div>获取路径：“微信公众平台”管理后台--“设置与开发”--“基本配置”</div>
        <div>
          <img style={{ width: '100%' }} src={appId} alt="appId" />
        </div>
      </div>
    </div>
  );
};
export default WeixinApp;
