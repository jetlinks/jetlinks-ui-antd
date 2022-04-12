const AliyunVoice = () => {
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
        阿里云语音服务平台：
        <a href="https://account.console.aliyun.com">https://account.console.aliyun.com</a>
      </div>
      <b>1. 概述</b>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
        使用阿里云语音时需先在阿里云语音服务平台创建语音模板。
      </div>
      <b>2.模板配置说明</b>
      <div>
        <div>1、绑定配置</div>
        <div> 绑定通知配置</div>
        <div> 2、模板ID</div>
        <div> 阿里云语音对每一条语音通知分配的唯一ID标识</div>
        <div> 3、被叫号码</div>
        <div> 当前仅支持国内手机号，此处若不填，则在模板调试和配置告警通知时手动填写</div>
        <div> 4、被叫显号</div>
        <div> 用户呼叫号码显示，必须是在阿里云购买的号码。</div>
        <div> 5、播放次数</div>
        <div> 最多可播放3次</div>
        <div> 6、变量属性</div>
        <div>
          {' '}
          阿里云语音模板可支持变量，但当前阿里云未提供相关语音模板内容接口，所以需要在当前页面手动设置与阿里云模板中一样的变量，否则会导致发送异常。
        </div>
      </div>
    </div>
  );
};
export default AliyunVoice;
