import { Image } from 'antd';

const DingTalkRebot = () => {
  const groupSetting = require('/public/images/notice/doc/config/dingTalk-rebot/01-group-setting.jpg');

  const rebot = require('/public/images/notice/doc/config/dingTalk-rebot/02-rebot.jpg');

  const webhook = require('/public/images/notice/doc/config/dingTalk-rebot/03-Webhook.jpg');
  return (
    <div>
      <b>1. 概述</b>
      <div>
        通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
      </div>
      <b>2.通知配置说明</b>
      <div>
        <div> 1. WebHook</div>
        <div>在钉钉群内每创建一个钉钉群自定义机器人都会产生唯一的WebHook地址。</div>
        <div>获取路径：“钉钉桌面客户端”--“群设置”--“智能群助手”--“机器人信息”</div>
        <div>
          <Image width="100%" src={rebot} />
        </div>
        <div>1、登录钉钉桌面客户端，进入群设置</div>
        <div>
          <Image width="100%" src={groupSetting} />
        </div>
        <div>2、点击智能群助手，查看机器人信息</div>
        <div>
          <Image width="100%" src={webhook} />
        </div>
      </div>
    </div>
  );
};
export default DingTalkRebot;
