import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import { service, StreamModel } from '@/pages/media/Stream';
import { useParams } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';

const re =
  /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;

// API host
interface APIComponentProps {
  onChange?: (data: any) => void;
  value?: {
    apiHost?: string;
    apiPort?: number;
  };
}

const APIComponent = (props: APIComponentProps) => {
  const { value, onChange } = props;
  const [data, setData] = useState<{ apiHost?: string; apiPort?: number } | undefined>(value);

  useEffect(() => {
    setData(value);
  }, [value]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Input
        onChange={(e) => {
          if (onChange) {
            const item = {
              ...data,
              apiHost: e.target.value,
            };
            setData(item);
            onChange(item);
          }
        }}
        value={data?.apiHost}
        style={{ marginRight: 10 }}
        placeholder="请输入API Host"
      />
      <InputNumber
        style={{ minWidth: 150 }}
        value={data?.apiPort}
        min={1}
        max={65535}
        onChange={(e: number) => {
          if (onChange) {
            const item = {
              ...data,
              apiPort: e,
            };
            setData(item);
            onChange(item);
          }
        }}
      />
    </div>
  );
};

interface RTPComponentProps {
  onChange?: (data: any) => void;
  value?: {
    rtpIp?: string;
    rtpPort?: number;
    dynamicRtpPort?: boolean;
    dynamicRtpPortRange?: number[];
  };
}

const RTPComponent = (props: RTPComponentProps) => {
  const { value, onChange } = props;
  const [checked, setChecked] = useState<boolean>(value?.dynamicRtpPort || false);
  const [data, setData] = useState<any>(value);

  useEffect(() => {
    setData(value);
    setChecked(!!value?.dynamicRtpPort);
  }, [value]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Input
        style={{ maxWidth: 400 }}
        placeholder="请输入RTP IP"
        value={data?.rtpIp}
        onChange={(e) => {
          if (onChange) {
            const item = {
              ...data,
              rtpIp: e.target.value,
            };
            setData(item);
            onChange(item);
          }
        }}
      />
      {!checked ? (
        <InputNumber
          style={{ minWidth: 150, margin: '0 10px' }}
          min={1}
          max={65535}
          value={data?.rtpPort}
          placeholder="请输入端口"
          onChange={(e) => {
            if (onChange) {
              const item = {
                ...data,
                rtpPort: e,
              };
              setData(item);
              onChange(item);
            }
          }}
        />
      ) : (
        <div style={{ margin: '0 10px' }}>
          <InputNumber
            style={{ minWidth: 150 }}
            min={1}
            max={65535}
            placeholder="起始端口"
            value={data?.dynamicRtpPortRange?.[0]}
            onChange={(e) => {
              if (onChange) {
                const item = {
                  ...data,
                  dynamicRtpPortRange: [e, data?.dynamicRtpPortRange?.[1]],
                };
                setData(item);
                onChange(item);
              }
            }}
          />{' '}
          至{' '}
          <InputNumber
            style={{ minWidth: 150 }}
            min={1}
            max={65535}
            placeholder="终止端口"
            value={data?.dynamicRtpPortRange?.[1]}
            onChange={(e) => {
              if (onChange) {
                const item = {
                  ...data,
                  dynamicRtpPortRange: [data?.dynamicRtpPortRange?.[0], e],
                };
                setData(item);
                onChange(item);
              }
            }}
          />
        </div>
      )}

      <Checkbox
        checked={data?.dynamicRtpPort}
        onChange={(e) => {
          setChecked(e.target.checked);
          if (onChange) {
            const item = {
              ...data,
              dynamicRtpPort: e.target.checked,
            };
            setData(item);
            onChange(item);
          }
        }}
      >
        动态端口
      </Checkbox>
    </div>
  );
};

const Detail = () => {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    service.queryProviders().then((resp) => {
      if (resp.status === 200) {
        setProviders(resp.result);
      }
    });
    if (params.id && params.id !== ':id') {
      service.detail(params.id).then((resp) => {
        if (resp.status === 200) {
          StreamModel.current = resp.result;
          form.setFieldsValue({
            name: StreamModel.current?.name,
            provider: StreamModel.current?.provider,
            secret: StreamModel.current?.configuration?.secret,
            api: {
              apiHost: StreamModel.current.configuration?.apiHost,
              apiPort: StreamModel.current.configuration?.apiPort,
            },
            rtp: {
              rtpIp: StreamModel.current.configuration?.rtpIp,
              rtpPort: StreamModel.current.configuration?.rtpPort,
              dynamicRtpPort: StreamModel.current.configuration?.dynamicRtpPort || false,
              dynamicRtpPortRange: StreamModel.current.configuration?.dynamicRtpPortRange || [],
            },
          });
        }
      });
    }
  }, [params.id]);

  const checkAPI = (_: any, value: { apiHost: string; apiPort: number }) => {
    if (Number(value.apiPort) < 1 || Number(value.apiPort) > 65535) {
      return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
    }
    if (!re.test(value.apiHost)) {
      return Promise.reject(new Error('请输入正确的IP地址'));
    }
    return Promise.resolve();
  };
  const checkRIP = (
    _: any,
    value: {
      rtpIp: string;
      rtpPort: number;
      dynamicRtpPort: boolean;
      dynamicRtpPortRange: number[];
    },
  ) => {
    if (!re.test(value.rtpIp)) {
      return Promise.reject(new Error('请输入正确的IP地址'));
    }
    if (value.dynamicRtpPort) {
      if (value.dynamicRtpPortRange) {
        if (value.dynamicRtpPortRange?.[0]) {
          if (
            Number(value.dynamicRtpPortRange?.[0]) < 1 ||
            Number(value.dynamicRtpPortRange?.[0]) > 65535
          ) {
            return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
          }
        }
        if (value.dynamicRtpPortRange?.[1]) {
          if (
            Number(value.dynamicRtpPortRange?.[1]) < 1 ||
            Number(value.dynamicRtpPortRange?.[1]) > 65535
          ) {
            return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
          }
        }
        if (
          value.dynamicRtpPortRange?.[0] &&
          value.dynamicRtpPortRange?.[1] &&
          value.dynamicRtpPortRange?.[0] > value.dynamicRtpPortRange?.[1]
        ) {
          return Promise.reject(new Error('终止端口需大于等于起始端'));
        }
      }
    } else {
      if (Number(value.rtpPort) < 1 || Number(value.rtpPort) > 65535) {
        return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
      }
    }
    return Promise.resolve();
  };

  return (
    <PageContainer>
      <Card>
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values: any) => {
            const param = {
              name: values.name,
              provider: values.provider,
              configuration: {
                secret: values?.secret,
                apiHost: values.api?.apiHost,
                apiPort: values.api?.apiPort,
                rtpIp: values.rtp?.rtpIp,
                rtpPort: values.rtp?.rtpPort,
                dynamicRtpPort: values.rtp?.dynamicRtpPort,
                dynamicRtpPortRange: values.rtp?.dynamicRtpPortRange || [],
              },
            };
            let resp = undefined;
            if (params.id && params.id !== ':id') {
              resp = await service.update({ ...param, id: params.id });
            } else {
              resp = await service.save(param);
            }
            if (resp && resp.status === 200) {
              message.success('操作成功！');
              history.back();
            }
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="流媒体名称"
                name="name"
                rules={[
                  {
                    required: true,
                    message: '请输入流媒体名称',
                  },
                  {
                    max: 64,
                    message: '最多输入64个字符',
                  },
                ]}
              >
                <Input placeholder="请输入流媒体名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="服务商"
                name="provider"
                rules={[{ required: true, message: '请选择服务商' }]}
              >
                <Select placeholder="请选择服务商">
                  {providers.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="密钥"
                name="secret"
                rules={[
                  {
                    max: 64,
                    message: '最多输入64个字符',
                  },
                ]}
              >
                <Input.Password placeholder="请输入密钥" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    API Host
                    <Tooltip style={{ marginLeft: 5 }} title="调用流媒体接口时请求的服务地址">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="api"
                rules={[{ required: true, message: '请输入API Host' }, { validator: checkAPI }]}
              >
                <APIComponent />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={
                  <span>
                    RTP IP
                    <Tooltip
                      style={{ marginLeft: 5 }}
                      title="视频设备将流推送到该IP地址下，部分设备仅支持IP地址，建议全是用IP地址"
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="rtp"
                rules={[{ required: true, message: '请输入RTP IP' }, { validator: checkRIP }]}
              >
                <RTPComponent />
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

export default Detail;
