import { TitleComponent } from '@/components';
import { getButtonPermission } from '@/utils/menu';
import { Badge, Button, Col, Form, Input, Row, Table, Tooltip } from 'antd';
import { service } from '@/pages/link/AccessConfig';
import { useHistory } from 'umi';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { onlyMessage } from '@/utils/util';
import styles from '@/pages/link/AccessConfig/Detail/Access/index.less';
import { Store } from 'jetlinks-store';
import { ProtocolMapping } from '@/pages/link/AccessConfig/Detail/data';

interface Props {
  prev: () => void;
  data: any;
  config: any;
  provider: any;
  view?: boolean;
  type: 'network' | 'edge' | 'cloud';
}

const Finish = (props: Props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [config, setConfig] = useState<any>({});

  const protocolList = Store.get('allProtocolList') || [];
  const networkList = Store.get('network') || [];

  const columnsMQTT: any[] = [
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      ellipsis: true,
      align: 'center',
      width: 100,
      onCell: (record: any, index: number) => {
        const list = (config?.routes || []).sort((a: any, b: any) => a - b) || [];
        const arr = list.filter((res: any) => {
          // 这里gpsNumber是我需要判断的字段名（相同就合并）
          return res?.group == record?.group;
        });
        if (index == 0 || list[index - 1]?.group != record?.group) {
          return { rowSpan: arr.length };
        } else {
          return { rowSpan: 0 };
        }
      },
    },
    {
      title: 'topic',
      dataIndex: 'topic',
      key: 'topic',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '上下行',
      dataIndex: 'stream',
      key: 'stream',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        const list = [];
        if (record?.upstream) {
          list.push('上行');
        }
        if (record?.downstream) {
          list.push('下行');
        }
        return <span>{list.join(',')}</span>;
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
  ];

  const columnsHTTP: any[] = [
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      ellipsis: true,
      width: 100,
      onCell: (record: any, index: number) => {
        const list = (config?.routes || []).sort((a: any, b: any) => a - b) || [];
        const arr = list.filter((res: any) => {
          // 这里gpsNumber是我需要判断的字段名（相同就合并）
          return res?.group == record?.group;
        });
        if (index == 0 || list[index - 1]?.group != record?.group) {
          return { rowSpan: arr.length };
        } else {
          return { rowSpan: 0 };
        }
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '示例',
      dataIndex: 'example',
      key: 'example',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      name: props.data.name,
      description: props.data.description,
    });
  }, [props.data]);

  useEffect(() => {
    if (props.type === 'network') {
      if (props.provider?.channel !== 'child-device') {
        service
          .getConfigView(props.config.protocol, ProtocolMapping.get(props.provider?.id))
          .then((resp) => {
            if (resp.status === 200) {
              setConfig(resp.result);
            }
          });
      } else {
        service.getChildConfigView(props.config.protocol).then((resp) => {
          if (resp.status === 200) {
            setConfig(resp.result);
          }
        });
      }
    }
  }, [props.config.protocol, props.provider]);

  const renderRightContent = (provider: string) => {
    if (provider === 'OneNet' || provider === 'Ctwing') {
      return (
        <div style={{ marginLeft: 10 }}>
          <TitleComponent data={'配置概览'} />
          <div>
            <div style={{ marginBottom: 10 }}>接入方式：{props.provider?.name || ''}</div>
            {props.provider?.description && (
              <div style={{ marginBottom: 10 }}>{props.provider?.description || ''}</div>
            )}
            <div style={{ marginBottom: 10 }}>消息协议：{props.config.protocol}</div>
            {config?.document && (
              <div style={{ marginBottom: 10 }}>
                {<ReactMarkdown>{config?.document}</ReactMarkdown> || ''}
              </div>
            )}
          </div>
          <TitleComponent data={'设备接入指引'} />
          <div>
            <div style={{ marginBottom: 10 }}>
              1、创建类型为{props?.provider?.id === 'OneNet' ? 'OneNet' : 'CTWing'}的设备接入网关
            </div>
            <div style={{ marginBottom: 10 }}>
              2、创建产品，并选中接入方式为
              {props?.provider?.id === 'OneNet'
                ? 'OneNet'
                : 'CTWing,选中后需填写CTWing平台中的产品ID、Master-APIkey。'}
            </div>
            {props?.provider?.id === 'OneNet' ? (
              <div style={{ marginBottom: 10 }}>
                3、添加设备，为每一台设备设置唯一的IMEI、IMSI码（需与OneNet平台中填写的值一致，若OneNet平台没有对应的设备，将会通过OneNet平台提供的LWM2M协议自动创建）
              </div>
            ) : (
              <div style={{ marginBottom: 10 }}>
                3、添加设备，为每一台设备设置唯一的IMEI、SN、IMSI、PSK码（需与CTWingt平台中填写的值一致，若CTWing平台没有对应的设备，将会通过CTWing平台提供的LWM2M协议自动创建）
              </div>
            )}
          </div>
        </div>
      );
    } else if (provider === 'official-edge-gateway' || provider === 'edge-child-device') {
      return (
        <div>
          <TitleComponent data={'配置概览'} />
          <div>
            <div style={{ marginBottom: 10 }}>接入方式：{props.provider?.name || ''}</div>
            {props.provider?.description && (
              <div style={{ marginBottom: 10 }}>{props.provider?.description || ''}</div>
            )}
            <div style={{ marginBottom: 10 }}>消息协议：{props.config.protocol}</div>
            {config?.document && (
              <div style={{ marginBottom: 10 }}>
                {<ReactMarkdown>{config?.document}</ReactMarkdown> || ''}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.config}>
          <div className={styles.item}>
            <div className={styles.title}>接入方式</div>
            <div className={styles.context}>{props.provider?.name}</div>
            <div className={styles.context}>{props.provider?.description}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>消息协议</div>
            <div className={styles.context}>
              {protocolList.find((i: any) => i.id === props?.config.protocol)?.name}
            </div>
            {config?.document && (
              <div className={styles.context}>
                {<ReactMarkdown>{config?.document}</ReactMarkdown>}
              </div>
            )}
          </div>
          <div className={styles.item}>
            <div className={styles.title}>网络组件</div>
            {(networkList.find((i: any) => i.id === props.config?.network)?.addresses || []).length
              ? (networkList.find((i: any) => i.id === props.config?.network)?.addresses || []).map(
                  (item: any) => (
                    <div key={item.address}>
                      <Badge color={item.health === -1 ? 'red' : 'green'} text={item.address} />
                    </div>
                  ),
                )
              : ''}
          </div>
          {config?.routes && config?.routes?.length > 0 && (
            <div className={styles.item}>
              <div style={{ fontWeight: '600', marginBottom: 10 }}>
                {props.data?.provider === 'mqtt-server-gateway' ||
                props.data?.provider === 'mqtt-client-gateway'
                  ? 'topic'
                  : 'URL信息'}
              </div>
              <Table
                bordered
                dataSource={config?.routes || []}
                columns={config.id === 'MQTT' ? columnsMQTT : columnsHTTP}
                pagination={false}
                scroll={{ y: 300 }}
              />
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Row gutter={24}>
      <Col span={12}>
        <div>
          <TitleComponent data={'基本信息'} />
          <Form name="basic" layout="vertical" form={form}>
            <Form.Item
              label="名称"
              name="name"
              rules={[
                { required: true, message: '请输入名称' },
                { max: 64, message: '最多可输入64字符' },
              ]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item name="description" label="说明">
              <Input.TextArea showCount maxLength={200} placeholder="请输入说明" />
            </Form.Item>
          </Form>
          <div style={{ marginTop: 50 }}>
            {props.provider?.id !== 'edge-child-device' && (
              <Button
                style={{ margin: '0 8px' }}
                onClick={() => {
                  props.prev();
                }}
              >
                上一步
              </Button>
            )}
            {!props.view && (
              <Button
                type="primary"
                disabled={
                  !!props.data.id
                    ? getButtonPermission('link/AccessConfig', ['update'])
                    : getButtonPermission('link/AccessConfig', ['add'])
                }
                onClick={async () => {
                  try {
                    const values = await form.validateFields();
                    let param: any = {};
                    if (props.type === 'network') {
                      param = {
                        name: values.name,
                        description: values.description,
                        provider: props.provider.id,
                        protocol: props.config.protocol,
                        transport:
                          props.provider?.id === 'child-device'
                            ? 'Gateway'
                            : ProtocolMapping.get(props.provider.id),
                        channel: 'network', // 网络组件
                        channelId: props.config.network,
                      };
                    } else if (props.type === 'cloud') {
                      param = {
                        ...props.data,
                        ...values,
                        provider: props.provider.id,
                        protocol: props.config.protocol,
                        transport: 'HTTP_SERVER',
                        configuration: {
                          ...props.config,
                        },
                      };
                    } else {
                      param = {
                        name: values.name,
                        description: values.description,
                        provider: props.provider.id,
                        protocol: props.config.protocol,
                        transport: ProtocolMapping.get(props.provider.id),
                        channelId: props?.config?.network,
                      };
                    }
                    const resp: any = await service[!props.data?.id ? 'save' : 'update']({
                      ...param,
                      id: props.data.id ? props.data.id : undefined,
                    });
                    if (resp.status === 200) {
                      onlyMessage('操作成功！');
                      history.goBack();
                      if ((window as any).onTabSaveSuccess) {
                        (window as any).onTabSaveSuccess(resp);
                        setTimeout(() => window.close(), 300);
                      }
                    }
                  } catch (errorInfo) {
                    console.error('Failed:', errorInfo);
                  }
                }}
              >
                保存
              </Button>
            )}
          </div>
        </div>
      </Col>
      <Col span={12}>{renderRightContent(props.provider.id)}</Col>
    </Row>
  );
};

export default Finish;
