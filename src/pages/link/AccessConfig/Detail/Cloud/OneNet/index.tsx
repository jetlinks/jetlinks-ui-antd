import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Tooltip, Image } from 'antd';
import { useEffect } from 'react';
import styles from './index.less';

interface Props {
  next: (data: any) => void;
  data: any;
}

const OneNet = (props: Props) => {
  const img = require('/public/images/network/OneNet.jpg');

  const [form] = Form.useForm();

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
          name="onenet"
          layout="vertical"
          form={form}
          initialValues={{
            apiAddress: 'https://api.heclouds.com/',
          }}
          onFinish={(values: any) => {
            props.next(values);
          }}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={
                  <span>
                    接口地址
                    <Tooltip title={`同步物联网平台设备数据到OneNet`}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="apiAddress"
                rules={[{ required: true, message: '请输入接口地址' }]}
              >
                <Input disabled placeholder="请输入接口地址" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<span>apiKey</span>}
                name="apiKey"
                rules={[{ required: true, message: '请输入apiKey' }]}
              >
                <Input placeholder="请输入apiKey" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    通知Token
                    <Tooltip title={`接收OneNet推送的Token地址`}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="validateToken"
                rules={[{ required: true, message: '请输入通知Token' }]}
              >
                <Input placeholder="请输入通知Token" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    aesKey
                    <Tooltip title={`OneNet 端生成的消息加密key`}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="aesKey"
              >
                <Input placeholder="请输入aesKey" />
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
          <div>1、创建类型为OneNet的设备接入网关</div>
          <div>2、创建产品，并选中接入方式为OneNet</div>
          <div>
            3、添加设备，为每一台设备设置唯一的IMEI、IMSI码（需与OneNet平台中填写的值一致，若OneNet平台没有对应的设备，将会通过OneNet平台提供的LWM2M协议自动创建）
          </div>
          <div className={styles.image}>
            <Image width="100%" src={img} />
          </div>
          <h1>配置说明</h1>
          <div>1.接口地址需要与OneNet数据推送配置中地址一致</div>
          <div>2.通知Token需要与OneNet数据推送配置中Token一致</div>
          <div>3.aesKey需要与OneNet数据推送配置中aesKey一致</div>
        </div>
      </Col>
    </Row>
  );
};

export default OneNet;
