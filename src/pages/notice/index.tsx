import { ContainerFilled, ToolFilled } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Row } from 'antd';
import dingding from '/public/images/dingding.png';
import styles from './index.less';
import { observer } from '@formily/react';
import { history } from 'umi';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';

const createImageLabel = (image: string, text: string) => {
  return (
    <>
      <img alt="" height="100px" src={image} />
      <div style={{ textAlign: 'center' }}>{text}</div>
    </>
  );
};

export const typeList = {
  weixin: [
    {
      label: createImageLabel(
        'https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/OKR.png',
        '企业消息',
      ),
      value: 'corpMessage',
    },
    {
      label: createImageLabel(
        'https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/Hire.png',
        '服务号消息',
      ),
      value: 'officialMessage',
    },
  ],
  dingTalk: [
    {
      label: createImageLabel(
        'https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/OKR.png',
        '钉钉消息',
      ),
      value: 'dingTalkMessage',
    },
    {
      label: createImageLabel(
        'https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/Hire.png',
        '群机器人消息',
      ),
      value: 'dingTalkRobotWebHook',
    },
  ],
  voice: [
    {
      label: createImageLabel(
        'https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/OKR.png',
        '阿里云语音',
      ),
      value: 'aliyun',
    },
  ],
  sms: [
    {
      label: createImageLabel(
        'https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/OKR.png',
        '阿里云短信',
      ),
      value: 'aliyunSms',
    },
  ],
  email: [
    {
      value: 'email',
      label: '默认',
    },
  ],
};

const Type = observer(() => {
  const list = [
    {
      type: 'dingTalk',
      icon: dingding,
    },
    {
      type: 'weixin',
      icon: dingding,
    },
    {
      type: 'email',
      icon: dingding,
    },
    {
      type: 'voice',
      icon: dingding,
    },
    {
      type: 'sms',
      icon: dingding,
    },
  ];

  return (
    <PageContainer
      title={false}
      // breadcrumbRender={() => {
      //   return <div>通知配置</div>;
      // }}
    >
      <Row gutter={[24, 24]}>
        {list.map((i) => (
          <Col span={12} key={i.type}>
            <Card>
              <Row>
                <Col span={12}>
                  <img style={{ height: 100 }} src={dingding} alt="dingding" />
                </Col>
                <Col span={3} push={4}>
                  <div className={styles.action}>
                    <Button
                      type={'link'}
                      onClick={() => {
                        history.push(
                          `${getMenuPathByCode(MENUS_CODE['notice/Template'])}?id=${i.type}`,
                        );
                      }}
                    >
                      <ContainerFilled className={styles.icon} />
                      <div>通知模版</div>
                    </Button>
                  </div>
                </Col>
                <Col span={3} push={6}>
                  <div className={styles.action}>
                    <Button
                      type={'link'}
                      onClick={() => {
                        history.push(
                          `${getMenuPathByCode(MENUS_CODE['notice/Config'])}?id=${i.type}`,
                        );
                      }}
                    >
                      <ToolFilled className={styles.icon} />
                      <div>通知配置</div>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
});
export default Type;
