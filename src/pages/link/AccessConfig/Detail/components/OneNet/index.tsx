import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Form, Image, Input, Row, Tooltip } from 'antd';
import { useEffect } from 'react';
import styles from './index.less';
import { randomString } from '@/utils/util';

interface Props {
  next: (data: any) => void;
  data: any;
}

const OneNet = (props: Props) => {
  const img = require('/public/images/network/OneNet.jpg');
  const img1 = require('/public/images/network/05.jpg');
  const img2 = require('/public/images/network/06.jpg');

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...props.data,
      apiAddress: 'https://api.heclouds.com/',
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
          <div>1、OneNet端创建产品、设备，并配置HTTP推送</div>
          <div>2、IOT端创建类型为OneNet的设备接入网关</div>
          <div>
            3、IOT端创建产品，选中接入方式为OneNet类型的设备接入网关，填写Master-APIkey（OneNet端的产品Key）
          </div>
          <div className={styles.image}>
            <Image width="100%" src={img1} />
          </div>
          <div>
            4、IOT端添加设备，在设备实例页面为每一台设备设置唯一的IMEI、IMSI码（需与OneNet平台中的值一致）
          </div>
          <div className={styles.image}>
            <Image width="100%" src={img2} />
          </div>
          <h1>HTTP推送配置说明</h1>
          <div className={styles.image}>
            <Image width="100%" src={img} />
          </div>
          <div>HTTP推送配置路径：应用开发&gt;数据推送</div>
          <Descriptions bordered size={'small'} column={1} labelStyle={{ width: 100 }}>
            <Descriptions.Item label="参数">说明</Descriptions.Item>
            <Descriptions.Item label="实例名称">推送实例的名称</Descriptions.Item>
            <Descriptions.Item label="推送地址">
              用于接收OneNet推送设备数据的地址物联网平台地址:
              <div style={{ wordWrap: 'break-word' }}>
                {origin}/api/one-net/{randomString()}/notify
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Token">
              自定义token,可用于验证请求是否来自OneNet
            </Descriptions.Item>
            <Descriptions.Item label="消息加密">
              采用AES加密算法对推送的数据进行数据加密，AesKey为加密秘钥
            </Descriptions.Item>
          </Descriptions>
          <h1>设备接入网关配置说明</h1>
          <Descriptions bordered size={'small'} column={1} labelStyle={{ width: 100 }}>
            <Descriptions.Item label="参数">说明</Descriptions.Item>
            <Descriptions.Item label="apiKey">OneNet平台中具体产品的Key</Descriptions.Item>
            <Descriptions.Item label="通知Token">
              填写OneNet数据推送配置中设置的Token
            </Descriptions.Item>
            <Descriptions.Item label="aesKey">
              若OneNet数据推送配置了消息加密，此处填写OneNet端数据推送配置中设置的aesKey
            </Descriptions.Item>
          </Descriptions>
          <h1>其他说明</h1>
          <div>
            1.在IOT端启用设备时，若OneNet平台没有与之对应的设备，则将在OneNet端自动创建新设备
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default OneNet;
