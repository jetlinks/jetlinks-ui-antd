import { Button, Col, Form, Input, Row, Image } from 'antd';
import { useEffect } from 'react';
import styles from './index.less';
import { randomString } from '@/utils/util';

interface Props {
  next: (data: any) => void;
  data: any;
}

const CTWing = (props: Props) => {
  const [form] = Form.useForm();
  const img1 = require('/public/images/network/01.png');
  const img2 = require('/public/images/network/02.jpg');
  const img3 = require('/public/images/network/03.png');
  const img4 = require('/public/images/network/04.jpg');

  useEffect(() => {
    form.setFieldsValue({
      ...props.data,
      apiAddress: 'https://ag-api.ctwing.cn/',
    });
  }, [props.data]);

  return (
    <Row gutter={24}>
      <Col span={16}>
        <Form
          name="CTWing"
          layout="vertical"
          form={form}
          initialValues={{
            apiAddress: 'https://ag-api.ctwing.cn/',
          }}
          onFinish={(values: any) => {
            props.next(values);
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="接口地址"
                name="apiAddress"
                rules={[{ required: true, message: '请输入接口地址' }]}
              >
                <Input disabled placeholder="请输入接口地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="appKey"
                name="appKey"
                rules={[{ required: true, message: '请输入appKey' }]}
              >
                <Input placeholder="请输入appKey" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="appSecret"
                name="appSecret"
                rules={[{ required: true, message: '请输入appSecret' }]}
              >
                <Input placeholder="请输入appSecret" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="说明">
                <Input.TextArea showCount maxLength={200} placeholder="请输入说明" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  下一步
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col span={8}>
        <div className={styles.doc}>
          <h1>操作指引：</h1>
          <div>1、CTWing端创建产品、设备，以及一个第三方应用</div>
          <div>
            2、CTWing端配置产品/设备/分组级订阅，订阅方URL地址请填写:
            <div style={{ wordWrap: 'break-word' }}>
              {origin}/api/ctwing/{randomString()}/notify
            </div>
          </div>
          <div className={styles.image}>
            <Image width="100%" src={img1} />
          </div>
          <div>3、IOT端创建类型为CTWing的设备接入网关</div>
          <div>
            4、IOT端创建产品，选中接入方式为CTWing,填写CTWing平台中的产品ID、Master-APIkey。
          </div>
          <div className={styles.image}>
            <Image width="100%" src={img2} />
          </div>
          <div>5、IOT端添加设备，为每一台设备设置唯一的IMEI（需与CTWing平台中填写的值一致）</div>
          <div className={styles.image}>
            <Image width="100%" src={img3} />
          </div>
          <h1>设备接入网关配置说明</h1>
          <div>1.请将CTWing的AEP平台-应用管理中的App Key和App Secret复制到当前页面</div>
          <div className={styles.image}>
            <Image width="100%" src={img4} />
          </div>
          <h1>其他说明</h1>
          <div>
            1.在IOT端启用设备时，若CTWing平台没有与之对应的设备，则将在CTWing端自动创建新设备
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CTWing;
