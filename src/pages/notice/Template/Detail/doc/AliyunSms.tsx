const AliyunSms = () => {
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
        阿里云短信服务平台：
        <a href="https://dysms.console.aliyun.com">https://dysms.console.aliyun.com</a>
      </div>
      <b>1. 概述</b>
      <div>
        通知模板结合通知配置为告警消息通知提供支撑。通知模板只能调用同一类型的通知配置服务。
        使用阿里云短信时需先在阿里云短信服务平台创建短信模板。
      </div>
      <b>2.模板配置说明</b>

      <div>
        <div> 1、绑定配置</div>
        <div> 绑定通知配置</div>
        <div> 2、模板ID</div>
        <div> 阿里云短信对每一条短信模板分配的唯一ID标识</div>
        <div> 3、收信人</div>
        <div> 当前仅支持国内手机号，此处若不填，则在模板调试和配置告警通知时手动填写</div>
        <div> 4、签名</div>
        <div> 用于短信内容签名信息显示，需在阿里云短信进行配置。</div>
        <div> 5、变量属性</div>
        <div>
          {' '}
          阿里云短信模板可支持变量，当前阿里云的接口可获取模板内容，但不能自动提取其中的变量，所以需要在当前页面手动设置与阿里云短信模板中一样的变量，否则会导致发送异常。
        </div>
      </div>
    </div>
  );
};
export default AliyunSms;
