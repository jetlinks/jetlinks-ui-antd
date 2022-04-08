import TitleComponent from '@/components/TitleComponent';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';
import SipComponent from '@/components/SipComponent';
import { testIP } from '@/utils/util';
import { useEffect, useState } from 'react';
import { service } from '../index';
import { useLocation } from 'umi';

const Save = () => {
  const location: any = useLocation();
  const [form] = Form.useForm();
  const [clusters, setClusters] = useState<any[]>([]);
  const id = location?.query?.id || '';

  const checkSIP = (_: any, value: { host: string; port: number }) => {
    if (!value) {
      return Promise.reject(new Error('请输入SIP'));
    } else if (Number(value.port) < 1 || Number(value.port) > 65535) {
      return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
    } else if (!testIP(value.host)) {
      return Promise.reject(new Error('请输入正确的IP地址'));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    service.queryClusters().then((resp) => {
      if (resp.status === 200) {
        setClusters(resp.result);
      }
    });
    if (!!id) {
      service.detail(id).then((resp) => {
        if (resp.status === 200) {
          const sipConfigs = resp.result?.sipConfigs[0];
          const data = {
            ...resp.result,
            sipConfigs: {
              ...sipConfigs,
              public: {
                host: sipConfigs.remoteAddress,
                port: sipConfigs.remotePort,
              },
              local: {
                host: sipConfigs.host,
                port: sipConfigs.port,
              },
            },
          };
          form.setFieldsValue(data);
        }
      });
    }
  }, []);

  return (
    <PageContainer>
      <Card>
        <Form
          name="cascade"
          layout="vertical"
          form={form}
          initialValues={{
            proxyStream: false,
            sipConfigs: {
              transport: 'UDP',
            },
          }}
          onFinish={async (values: any) => {
            const sipConfigs = {
              ...values.sipConfigs,
              remoteAddress: values.sipConfigs.public.host,
              remotePort: values.sipConfigs.public.port,
              host: values.sipConfigs.local.host,
              port: values.sipConfigs.local.port,
            };
            delete values.sipConfigs;
            delete sipConfigs.public;
            delete sipConfigs.local;
            const param = { ...values, sipConfigs: [sipConfigs] };
            let resp = undefined;
            if (id) {
              resp = await service.update({ ...param, id });
            } else {
              resp = await service.save(param);
            }
            if (resp && resp.status === 200) {
              message.success('操作成功！');
              history.back();
            }
          }}
        >
          <Row gutter={24}>
            <TitleComponent data={'基本信息'} />
            <Col span={12}>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span>代理视频流</span>}
                name="proxyStream"
                rules={[{ required: true, message: '请选择代理视频流' }]}
              >
                <Radio.Group optionType="button" buttonStyle="solid">
                  <Radio.Button value={true}>启用</Radio.Button>
                  <Radio.Button value={false}>禁用</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <TitleComponent data={'信令服务配置'} />
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    集群节点
                    <Tooltip title="使用此集群节点级联到上级平台">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name={['sipConfigs', 'clusterNodeId']}
                rules={[{ required: true, message: '请选择信令服务配置' }]}
              >
                <Select placeholder="请选择信令服务配置">
                  {clusters.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="信令名称"
                name={['sipConfigs', 'name']}
                rules={[{ required: true, message: '请输入信令名称' }]}
              >
                <Input placeholder="请输入信令名称" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="上级SIP ID"
                name={['sipConfigs', 'sipId']}
                rules={[{ required: true, message: '请输入上级SIP ID' }]}
              >
                <Input placeholder="请输入上级SIP ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="上级SIP域"
                name={['sipConfigs', 'domain']}
                rules={[{ required: true, message: '请输入上级SIP域' }]}
              >
                <Input placeholder="请输入上级SIP域" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="上级SIP 地址"
                name={['sipConfigs', 'public']}
                rules={[{ required: true, message: '请输入上级SIP 地址' }, { validator: checkSIP }]}
              >
                <SipComponent />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="本地SIP ID"
                name={['sipConfigs', 'localSipId']}
                rules={[{ required: true, message: '请输入本地SIP ID' }]}
              >
                <Input placeholder="请输入本地SIP ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="传输协议"
                name={['sipConfigs', 'transport']}
                rules={[{ required: true, message: '请选择传输协议' }]}
              >
                <Radio.Group optionType="button" buttonStyle="solid">
                  <Radio.Button value="UDP">UDP</Radio.Button>
                  <Radio.Button value="TCP">TCP</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    SIP本地地址
                    <Tooltip title="使用指定的网卡和端口进行请求">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name={['sipConfigs', 'local']}
                rules={[{ required: true, message: '请输入SIP本地地址' }, { validator: checkSIP }]}
              >
                <SipComponent />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="用户"
                name={['sipConfigs', 'user']}
                rules={[{ required: true, message: '请输入用户' }]}
              >
                <Input placeholder="请输入用户" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="接入密码"
                name={['sipConfigs', 'password']}
                rules={[{ required: true, message: '请输入接入密码' }]}
              >
                <Input.Password placeholder="请输入接入密码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="厂商"
                name={['sipConfigs', 'manufacturer']}
                rules={[{ required: true, message: '请输入厂商' }]}
              >
                <Input placeholder="请输入厂商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="型号"
                name={['sipConfigs', 'model']}
                rules={[{ required: true, message: '请输入型号' }]}
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="版本号"
                name={['sipConfigs', 'firmware']}
                rules={[{ required: true, message: '请输入版本号' }]}
              >
                <Input placeholder="请输入版本号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="心跳周期（秒）"
                name={['sipConfigs', 'keepaliveInterval']}
                rules={[{ required: true, message: '请输入心跳周期' }]}
              >
                <InputNumber placeholder="请输入心跳周期" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="注册间隔（秒）"
                name={['sipConfigs', 'registerInterval']}
                rules={[{ required: true, message: '请输入注册间隔' }]}
              >
                <InputNumber placeholder="请输入注册间隔" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Save;
