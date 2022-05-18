import { ContainerFilled, ToolFilled } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Row, Space } from 'antd';
import styles from './index.less';
import { observer } from '@formily/react';
import { history } from 'umi';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';

const createImageLabel = (image: string, text: string) => {
  return (
    <div style={{ margin: 5 }}>
      <img alt="" height="100px" src={image} />
      <div style={{ textAlign: 'center' }}>{text}</div>
    </div>
  );
};
const weixinCorp = require('/public/images/notice/weixin-corp.png');
// const weixinOfficial = require('/public/images/notice/weixin-official.png');
const dingTalkMessage = require('/public/images/notice/dingTalk-message.png');
const dingTalkRebot = require('/public/images/notice/dingTalk-rebot.png');
const sms = require('/public/images/notice/sms.png');
const vocie = require('/public/images/notice/voice.png');
const webhook = require('/public/images/notice/webhook.png');

export const typeList = {
  weixin: [
    {
      label: createImageLabel(weixinCorp, '企业消息'),
      value: 'corpMessage',
    },
    // {
    //   label: createImageLabel(weixinOfficial, '服务号消息'),
    //   value: 'officialMessage',
    // },
  ],
  dingTalk: [
    {
      label: createImageLabel(dingTalkMessage, '钉钉消息'),
      value: 'dingTalkMessage',
    },
    {
      label: createImageLabel(dingTalkRebot, '群机器人消息'),
      value: 'dingTalkRobotWebHook',
    },
  ],
  voice: [
    {
      label: createImageLabel(vocie, '阿里云语音'),
      value: 'aliyun',
    },
  ],
  sms: [
    {
      label: createImageLabel(sms, '阿里云短信'),
      value: 'aliyunSms',
    },
  ],
  email: [
    {
      value: 'embedded',
      label: '默认',
    },
  ],
  webhook: [
    {
      label: createImageLabel(webhook, 'Webhook'),
      value: 'http',
    },
  ],
};

const Type = observer(() => {
  const list = [
    {
      type: 'dingTalk',
      name: '钉钉',
      describe: '支持钉钉消息、群机器人消息类型',
    },
    {
      type: 'weixin',
      name: '微信',
      describe: '支持企业消息、服务号消息类型',
    },
    {
      type: 'email',
      name: '邮件',
      describe: '支持国内通用和自定义邮件类型',
    },
    {
      type: 'voice',
      name: '语音',
      describe: '支持阿里云语音消息类型',
    },
    {
      type: 'sms',
      name: '短信',
      describe: '支持阿里云短信消息类型',
    },
    {
      type: 'webhook',
      name: 'webhook',
      describe: '支持websocket消息通知',
    },
  ];

  const iconMap = new Map();
  iconMap.set('dingTalk', require('/public/images/notice/dingtalk.png'));
  iconMap.set('weixin', require('/public/images/notice/wechat.png'));
  iconMap.set('email', require('/public/images/notice/email.png'));
  iconMap.set('voice', require('/public/images/notice/voice.png'));
  iconMap.set('sms', require('/public/images/notice/sms.png'));
  iconMap.set('webhook', require('/public/images/notice/webhook.png'));

  const bGroundMap = new Map();
  bGroundMap.set('dingTalk', require('/public/images/notice/dingtalk-background.png'));
  bGroundMap.set('weixin', require('/public/images/notice/wechat-background.png'));
  bGroundMap.set('email', require('/public/images/notice/email-background.png'));
  bGroundMap.set('voice', require('/public/images/notice/voice-background.png'));
  bGroundMap.set('sms', require('/public/images/notice/sms-background.png'));
  bGroundMap.set('webhook', require('/public/images/notice/webhook-backgroud.png'));

  return (
    <PageContainer
      title={false}
      // breadcrumbRender={() => {
      //   return <div>config</div>;
      // }}
    >
      <Row gutter={[24, 24]}>
        {list.map((i) => (
          <Col span={12} key={i.type}>
            <Card
              style={{
                background: `url(${bGroundMap.get(i.type)}) no-repeat`,
                backgroundSize: '100% 100%',
              }}
            >
              <div className={styles.content}>
                <div className={styles.left}>
                  <img style={{ height: 104 }} src={iconMap.get(i.type)} alt="dingding" />
                  <div className={styles.context}>
                    <div className={styles.title}>{i.name}</div>
                    <div className={styles.desc}>{i.describe}</div>
                  </div>
                </div>
                <div className={styles.right}>
                  <Space>
                    <div className={styles.action}>
                      <Button
                        type={'link'}
                        onClick={() => {
                          history.push(
                            `${getMenuPathByCode(MENUS_CODE['notice/Template'])}?id=${i.type}`,
                          );
                        }}
                      >
                        <div className={styles.btn}>
                          <ContainerFilled className={styles.icon} />
                          <div>通知模版</div>
                        </div>
                      </Button>
                    </div>
                    <div className={styles.action}>
                      <Button
                        type={'link'}
                        onClick={() => {
                          history.push(
                            `${getMenuPathByCode(MENUS_CODE['notice/Config'])}?id=${i.type}`,
                          );
                        }}
                      >
                        <div className={styles.btn}>
                          <ToolFilled className={styles.icon} />
                          <div>通知配置</div>
                        </div>
                      </Button>
                    </div>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
});
export default Type;
