import TitleComponent from '@/components/TitleComponent';
import { InfoCircleFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';
import SipComponent from '@/components/SipComponent';
import SipSelectComponent from '@/components/SipSelectComponent';
import { testIP } from '@/utils/util';
import { useEffect, useState } from 'react';
import { service } from '../index';
import { useLocation } from 'umi';
import styles from './index.less';

const Save = () => {
  const location: any = useLocation();
  const [form] = Form.useForm();
  const [clusters, setClusters] = useState<any[]>([]);
  const id = location?.query?.id || '';
  const [list, setList] = useState<any[]>([]);
  const [transport, setTransport] = useState<'UDP' | 'TCP'>('UDP');

  const checkSIP = (_: any, value: { host: string; port: number }) => {
    if (!value) {
      return Promise.resolve();
    } else if (!value.host) {
      return Promise.reject(new Error('请输入IP 地址'));
    } else if (value?.host && !testIP(value.host)) {
      return Promise.reject(new Error('请输入正确的IP地址'));
    } else if (!value?.port) {
      return Promise.reject(new Error('请输入端口'));
    } else if ((value?.port && Number(value.port) < 1) || Number(value.port) > 65535) {
      return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
    }
    return Promise.resolve();
  };
  const checkLocalSIP = (_: any, value: { host: string; port: number }) => {
    if (!value) {
      return Promise.resolve();
    } else if (!value.host) {
      return Promise.reject(new Error('请选择IP地址'));
    } else if (!value?.port) {
      return Promise.reject(new Error('请选择端口'));
    }
    return Promise.resolve();
  };
  useEffect(() => {
    service.queryClusters().then((resp) => {
      if (resp.status === 200) {
        setClusters(resp.result);
      }
    });
    service.queryResources().then((resp) => {
      if (resp.status === 200) {
        setList(resp.result);
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
              remotePublic: {
                host: sipConfigs.publicHost,
                port: sipConfigs.publicPort,
              },
            },
          };
          form.setFieldsValue(data);
        }
      });
    }
  }, []);

  const keepValidator = (_: any, value: any) => {
    if ((!value && value !== 0) || (Number(value) >= 1 && Number(value) <= 10000)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入1~10000之间的数字'));
  };

  const img1 = require('/public/images/northbound/doc1.png');
  const img2 = require('/public/images/northbound/doc2.png');
  const img3 = require('/public/images/northbound/doc3.png');

  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={12}>
            <Form
              name="cascade"
              layout="vertical"
              form={form}
              initialValues={{
                proxyStream: false,
                sipConfigs: {
                  transport: 'UDP',
                  keepaliveInterval: 60,
                  registerInterval: 3000,
                },
              }}
              onFinish={async (values: any) => {
                const sipConfigs = {
                  ...values.sipConfigs,
                  remoteAddress: values.sipConfigs.public.host,
                  remotePort: values.sipConfigs.public.port,
                  host: values.sipConfigs.local.host,
                  port: values.sipConfigs.local.port,
                  publicHost: values.sipConfigs.remotePublic.host,
                  publicPort: values.sipConfigs.remotePublic.port,
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
                    rules={[{ required: true, message: '请选择集群节点' }]}
                  >
                    <Select placeholder="请选择集群节点">
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
                    rules={[{ required: true, message: '请输入上级平台SIP域' }]}
                  >
                    <Input placeholder="请输入上级平台SIP域" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="上级SIP 地址"
                    name={['sipConfigs', 'public']}
                    rules={[
                      { required: true, message: '请输入上级SIP 地址' },
                      { validator: checkSIP },
                    ]}
                  >
                    <SipComponent />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="本地SIP ID"
                    name={['sipConfigs', 'localSipId']}
                    rules={[{ required: true, message: '请输入网关侧的SIP ID' }]}
                  >
                    <Input placeholder="网关侧的SIP ID" />
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
                    rules={[
                      { required: true, message: '请输入SIP本地地址' },
                      { validator: checkLocalSIP },
                    ]}
                  >
                    <SipSelectComponent data={list} transport={transport} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="SIP远程地址"
                    name={['sipConfigs', 'remotePublic']}
                    rules={[
                      { required: true, message: '请输入SIP远程地址' },
                      { validator: checkSIP },
                    ]}
                  >
                    <SipComponent />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="传输协议"
                    name={['sipConfigs', 'transport']}
                    rules={[{ required: true, message: '请选择传输协议' }]}
                  >
                    <Radio.Group
                      optionType="button"
                      buttonStyle="solid"
                      onChange={(e) => {
                        setTransport(e.target.value);
                      }}
                    >
                      <Radio.Button value="UDP">UDP</Radio.Button>
                      <Radio.Button value="TCP">TCP</Radio.Button>
                    </Radio.Group>
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
                    rules={[
                      { required: true, message: '请输入心跳周期' },
                      { validator: keepValidator },
                    ]}
                  >
                    <InputNumber placeholder="请输入心跳周期" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="注册间隔（秒）"
                    name={['sipConfigs', 'registerInterval']}
                    rules={[
                      { required: true, message: '请输入注册间隔' },
                      { validator: keepValidator },
                    ]}
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
          </Col>
          <Col span={12}>
            <div className={styles.doc}>
              <h1>1.概述</h1>
              <div>配置国标级联，平台可以将已经接入到自身的摄像头共享给第三方调用播放。</div>
              <div>
                <Alert
                  icon={<InfoCircleFilled style={{ fontSize: 16, marginTop: 5 }} />}
                  description="注：该配置只用于将本平台向上级联至第三方平台，如需第三方平台向上级联至本平台，请在“视频设备”页面新增设备时选择“GB/T28181”接入方式。"
                  showIcon
                />
              </div>
              <h1>2.配置说明</h1>
              <div>以下配置说明以将本平台数据级联到LiveGBS平台为例。</div>
              <h2>1、上级SIP ID</h2>
              <div>
                请填写第三方平台中配置的<b>SIP ID</b>。
              </div>
              <div className={styles.image}>
                <Image width="100%" src={img2} />
              </div>
              <h2>2、上级SIP 域</h2>
              <div>
                请填写第三方平台中配置的<b>SIP ID域</b>。
              </div>
              <div className={styles.image}>
                <Image width="100%" src={img1} />
              </div>
              <h2>3、上级SIP 地址</h2>
              <div>
                请填写第三方平台中配置的<b>SIP ID地址</b>。
              </div>
              <div className={styles.image}>
                <Image width="100%" src={img3} />
              </div>
              <h2>4、本地SIP ID</h2>
              <div>
                请填写本地的<b>SIP ID地址</b>。
                地址由中心编码(8位)、行业编码(2位)、类型编码(3位)和序号(7位)四个码段共20位十
                进制数字字符构成。详细规则请参见《GB/T28181-2016》中附录D部分。
              </div>
              <h2>5、SIP本地地址</h2>
              <div>
                请选择<b>指定的网卡和端口</b>，如有疑问请联系系统运维人员。
              </div>
              <h2>6、用户</h2>
              <div>
                部分平台有基于用户和接入密码的特殊认证。通常情况下,请填写<b>本地SIP ID</b>值。
              </div>
              <h2>7、接入密码</h2>
              <div>需与上级平台设置的接入密码一致，用于身份认证。</div>
              <h2>8、厂商/型号/版本号</h2>
              <div>
                本平台将以“设备”的身份级联到上级平台，请设置本平台在上级平台中显示的厂商、型号、版本号。
              </div>
              <h2>9、心跳周期</h2>
              <div>需与上级平台设置的心跳周期保持一致，通常默认60秒。</div>
              <h2>10、注册间隔</h2>
              <div>
                若SIP代理通过注册方式校时,其注册间隔时间宜设置为小于 SIP代理与 SIP服务器出现1s误
                差所经过的运行时间。
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Save;
