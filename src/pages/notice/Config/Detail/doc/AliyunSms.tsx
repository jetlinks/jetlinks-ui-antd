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
        阿里云管理控制台：
        <a href="https://home.console.aliyun.com">https://home.console.aliyun.com</a>
      </div>
      <b>1. 概述</b>
      <div>
        通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
      </div>
      <b>2.通知配置说明</b>
      <div>
        <div>1. RegionID</div>
        <div>阿里云内部给每台机器设置的唯一编号。请根据购买的阿里云服务器地址进行填写。</div>
        <div>
          阿里云地域和可用区对照表地址：https://help.aliyun.com/document_detail/40654.html?spm=a2c6h.13066369.0.0.54a174710O7rWH
        </div>
      </div>
      <b>2、AccesskeyID/Secret</b>
      <div>
        <div>用于程序通知方式调用云服务费API的用户标识和秘钥</div>
        <div>获取路径：“阿里云管理控制台”--“用户头像”--“”--“AccessKey管理”--“查看”</div>
      </div>
    </div>
  );
};
export default AliyunSms;
