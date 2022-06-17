import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { service, StreamModel } from '@/pages/media/Stream';
import { useParams } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import SipComponent from '@/components/SipComponent';
import { onlyMessage, testIP } from '@/utils/util';

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
    if (params.id && params.id != ':id') {
      service.detail(params.id).then((resp) => {
        if (resp.status === 200) {
          StreamModel.current = resp.result;
          const data = {
            name: StreamModel.current?.name,
            provider: StreamModel.current?.provider,
            secret: StreamModel.current?.configuration?.secret,
            api: {
              host: StreamModel.current.configuration?.apiHost,
              port: StreamModel.current.configuration?.apiPort,
            },
            rtp: {
              rtpIp: StreamModel.current.configuration?.rtpIp,
              rtpPort: StreamModel.current.configuration?.rtpPort,
              dynamicRtpPort: StreamModel.current.configuration?.dynamicRtpPort || false,
              dynamicRtpPortRange: StreamModel.current.configuration?.dynamicRtpPortRange || [],
            },
          };
          form.setFieldsValue(data);
        }
      });
    }
  }, [params.id]);

  const checkSIP = (_: any, value: { host: string; port: number }) => {
    if (!value) {
      return Promise.resolve();
    }
    if (!value || !value.host) {
      return Promise.reject(new Error('请输入API HOST'));
    } else if (value?.host && !testIP(value.host)) {
      return Promise.reject(new Error('请输入正确的IP地址'));
    } else if (!value?.port) {
      return Promise.reject(new Error('请输入端口'));
    } else if ((value?.port && Number(value.port) < 1) || Number(value.port) > 65535) {
      return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
    }
    return Promise.resolve();
  };

  const testPort = (value: any) => {
    return (value && Number(value) < 1) || Number(value) > 65535;
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
    if (!value) {
      return Promise.resolve();
    }
    if (!value || !value.rtpIp) {
      return Promise.reject(new Error('请输入RTP IP'));
    } else if (value?.rtpIp && !testIP(value.rtpIp)) {
      return Promise.reject(new Error('请输入正确的IP地址'));
    } else if (!value.dynamicRtpPort) {
      if (value.rtpIp && !testIP(value.rtpIp)) {
        return Promise.reject(new Error('请输入正确的IP地址'));
      }
      if (!value?.rtpPort) {
        return Promise.reject(new Error('请输入端口'));
      }
      if (testPort(value?.rtpPort)) {
        return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
      }
    } else if (value.dynamicRtpPort) {
      if (value.dynamicRtpPortRange) {
        if (!value.dynamicRtpPortRange?.[0]) {
          return Promise.reject(new Error('请输入起始端口'));
        } else if (testPort(value.dynamicRtpPortRange?.[0])) {
          return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
        }
        if (!value.dynamicRtpPortRange?.[1]) {
          return Promise.reject(new Error('请输入终止端口'));
        } else if (testPort(value.dynamicRtpPortRange?.[1])) {
          return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
        }
        if (
          value.dynamicRtpPortRange?.[0] &&
          value.dynamicRtpPortRange?.[1] &&
          value.dynamicRtpPortRange?.[0] > value.dynamicRtpPortRange?.[1]
        ) {
          return Promise.reject(new Error('终止端口需大于等于起始端'));
        }
      } else if (!value.dynamicRtpPortRange) {
        return Promise.reject(new Error('请输入端口'));
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
                apiHost: values.api?.host,
                apiPort: values.api?.port,
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
              onlyMessage('操作成功！');
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
                rules={[{ required: true }, { validator: checkSIP }]}
              >
                <SipComponent />
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
                rules={[{ required: true }, { validator: checkRIP }]}
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
