import './index.less';

const AliyunVoice = () => {
  return (
    <div className="doc">
      <div className="url">
        阿里云语音服务平台：
        <a href="https://account.console.aliyun.com" target="_blank" rel="noopener noreferrer">
          https://account.console.aliyun.com
        </a>
      </div>
      <h1>1. 概述</h1>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
        使用阿里云语音时需先在阿里云语音服务平台创建语音模板。
      </div>
      <h1>2.模板配置说明</h1>
      <div>
        <h2>1、绑定配置</h2>
        <div> 使用固定的通知配置发送此通知模板</div>
        <h2> 2、模板ID</h2>
        <div> 阿里云语音对每一条语音通知分配的唯一ID标识</div>
        <h2> 3、被叫号码</h2>
        <div> 当前仅支持国内手机号，此处若不填，则在模板调试和配置告警通知时手动填写</div>
        <h2> 4、被叫显号</h2>
        <div> 用户呼叫号码显示，必须是在阿里云购买的号码。</div>
        <h2> 5、播放次数</h2>
        <div> 最多可播放3次</div>
        <h2> 6、变量属性</h2>
        <div>
          阿里云语音模板可支持变量，但当前阿里云未提供相关语音模板内容接口，所以需要在当前页面手动设置与阿里云模板中一样的变量，否则会导致发送异常。
        </div>
      </div>
    </div>
  );
};
export default AliyunVoice;
