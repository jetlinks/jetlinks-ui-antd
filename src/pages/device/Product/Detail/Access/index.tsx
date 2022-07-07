import { Badge, Button, Col, Empty, Row, Table, Tooltip } from 'antd';
import { service } from '@/pages/link/AccessConfig';
import { productModel, service as productService } from '@/pages/device/Product';
import styles from './index.less';
import type { SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import AccessConfig from './AccessConfig';
import ReactMarkdown from 'react-markdown';
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Password,
  PreviewText,
  Select,
} from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import type { ConfigProperty } from '@/pages/device/Product/typings';
import { createSchemaField } from '@formily/react';
import { createForm } from '@formily/core';
import { QuestionCircleOutlined } from '@ant-design/icons';
import TitleComponent from '@/components/TitleComponent';
import usePermissions from '@/hooks/permission';
import { onlyMessage } from '@/utils/util';
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import './index.less';

const componentMap = {
  string: 'Input',
  password: 'Password',
  enum: 'Select',
};

const Access = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const [config, setConfig] = useState<any>();
  const [access, setAccess] = useState<any>();
  const { permission } = usePermissions('device/Product');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [storageList, setStorageList] = useState<any[]>([]);

  const MetworkTypeMapping = new Map();
  MetworkTypeMapping.set('websocket-server', 'WEB_SOCKET_SERVER');
  MetworkTypeMapping.set('http-server-gateway', 'HTTP_SERVER');
  MetworkTypeMapping.set('udp-device-gateway', 'UDP');
  MetworkTypeMapping.set('coap-server-gateway', 'COAP_SERVER');
  MetworkTypeMapping.set('mqtt-client-gateway', 'MQTT_CLIENT');
  MetworkTypeMapping.set('mqtt-server-gateway', 'MQTT_SERVER');
  MetworkTypeMapping.set('tcp-server-gateway', 'TCP_SERVER');
  MetworkTypeMapping.set('fixed-media', 'TCP_CLIENT');
  MetworkTypeMapping.set('gb28181-2016', 'UDP');

  const [configVisible, setConfigVisible] = useState<boolean>(false);

  const [metadata, setMetadata] = useState<ConfigMetadata[]>([]);

  const steps = [
    {
      element: '#metadata-driver',
      popover: {
        className: 'driver',
        title: `<div id='title'>配置物模型</div><div id='guide'>1/3</div>`,
        description: `配置产品物模型，实现设备在云端的功能描述。`,
        position: 'bottom',
      },
    },
    {
      element: '.ant-switch',
      popover: {
        className: 'driver',
        title: `<div id='title'>启用产品</div><div id='guide'>2/3</div>`,
        description: '启用产品后，可在产品下新增设备。',
        position: 'bottom',
      },
    },
    {
      element: '.ant-descriptions-item-label',
      popover: {
        className: 'driver',
        title: `<div id='title'>添加设备</div><div id='guide'>3/3</div>`,
        description: '添加设备，并连接到平台。',
        position: 'bottom',
      },
    },
  ];
  const steps1 = [
    {
      element: '#driver-config',
      popover: {
        className: 'driver',
        title: `<div id='title'>填写配置</div><div id='guide'>1/4</div>`,
        description: `填写设备接入所需的配置参数。`,
        position: 'right',
      },
    },
    {
      element: '#metadata-driver',
      popover: {
        className: 'driver',
        title: `<div id='title'>配置物模型</div><div id='guide'>2/4</div>`,
        description: `配置产品物模型，实现设备在云端的功能描述。`,
        position: 'bottom',
      },
    },
    {
      element: '.ant-switch',
      popover: {
        className: 'driver',
        title: `<div id='title'>启用产品</div><div id='guide'>3/4</div>`,
        description: '启用产品后，可在产品下新增设备。',
        position: 'bottom',
      },
    },
    {
      element: '.ant-descriptions-item-label',
      popover: {
        className: 'driver',
        title: `<div id='title'>添加设备</div><div id='guide'>4/4</div>`,
        description: '添加设备，并连接到平台。',
        position: 'bottom',
      },
    },
  ];

  const queryAccessDetail = (id: string) => {
    service
      .queryGatewayDetail({
        terms: [
          {
            column: 'id',
            value: id,
          },
        ],
      })
      .then((resp) => {
        setAccess(resp.result.data[0]);
      });
  };

  const getConfigDetail = (messageProtocol: string, transportProtocol: string) => {
    service.getConfigView(messageProtocol, transportProtocol).then((resp) => {
      if (resp.status === 200) {
        setConfig(resp.result);
      }
    });
  };

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

  const id = productModel.current?.id;

  useEffect(() => {
    const driver = new Driver({
      allowClose: false,
      doneBtnText: '我知道了',
      closeBtnText: '不在提示',
      nextBtnText: '下一步',
      prevBtnText: '上一步',
      // onDeselected:(e)=>{
      //   console.log(e)
      // },
      onNext: () => {
        console.log('下一步');
      },
      onPrevious: () => {
        console.log('上一步');
      },
      onReset: () => {
        console.log('关闭');
      },
      // onDeselected:()=>{
      //   console.log('oncolse')
      // }
    });
    setVisible(!!productModel.current?.accessId);
    if (productModel.current?.accessId) {
      if (id) {
        productService
          .getConfigMetadata(id)
          .then((resp: { result: SetStateAction<ConfigMetadata[]> }) => {
            setMetadata(resp.result);
            if (resp.result && resp.result.length > 0) {
              driver.defineSteps(steps1);
              driver.start();
            } else {
              driver.defineSteps(steps);
              driver.start();
            }
          });
      }
      queryAccessDetail(productModel.current?.accessId);
      getConfigDetail(
        productModel.current?.messageProtocol || '',
        productModel.current?.transportProtocol || '',
      );
      service.getProviders().then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
      });
    } else {
      if (id) {
        productService
          .getConfigMetadata(id)
          .then((resp: { result: SetStateAction<ConfigMetadata[]> }) => {
            setMetadata(resp.result);
          });
      }
    }
    productService.getStoragList().then((resp) => {
      if (resp.status === 200) {
        setStorageList(
          resp.result.map((i: any) => ({
            label: i.name,
            value: i.id,
          })),
        );
      }
    });
  }, [productModel.current]);

  // useEffect(() => {
  //   console.log(productModel.current)
  //   console.log(productModel.current?.accessId)
  //   const driver = new Driver({
  //     allowClose: false,
  //     doneBtnText: '我知道了',
  //     closeBtnText: '不在提示',
  //     nextBtnText: '下一步',
  //     prevBtnText: '上一步'
  //   });
  //   if (productModel.current?.accessId) {
  //     setTimeout(() => {
  //       driver.defineSteps(steps)
  //       driver.start();
  //     }, 1000)
  //   }
  // }, [])

  const form = createForm({
    validateFirst: true,
    initialValues: {
      ...productModel.current?.configuration,
      storePolicy: productModel.current?.storePolicy,
    },
  });

  const SchemaField = createSchemaField({
    components: {
      Password,
      FormGrid,
      PreviewText,
      FormItem,
      Input,
      Select,
    },
  });

  const configToSchema = (data: ConfigProperty[]) => {
    const obj: any = {};
    data.forEach((item) => {
      obj[item?.property] = {
        type: 'string',
        title: item.name,
        'x-decorator': 'FormItem',
        'x-component': componentMap[item.type.type],
        'x-component-props': {
          placeholder: item.type.type === 'enum' ? '请选择' : '请输入',
        },
        'x-decorator-props': {
          tooltip: item.description,
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
        },
        enum:
          item?.type?.type === 'enum' && item?.type?.elements
            ? (item?.type?.elements || []).map((t: { value: string; text: string }) => {
                return {
                  label: t.text,
                  value: t.value,
                };
              })
            : [],
      };
    });

    return obj;
  };

  const getDetailInfo = () => {
    productService.getProductDetail(id || '').subscribe((data) => {
      if (data) {
        productModel.current = {
          ...productModel.current,
          ...data,
        };
      }
    });
  };

  const renderConfigCard = () => {
    const itemSchema: any = (metadata || []).map((item: any) => {
      return {
        type: 'object',
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              maxColumns: 1,
              minColumns: 1,
              columnGap: 48,
            },
            title: (
              <TitleComponent
                data={
                  <div className="config">
                    {item.name}
                    <Tooltip title="此配置来自于该产品接入方式所选择的协议">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                }
              />
            ),
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              layout: 'vertical',
            },
            properties: configToSchema(item.properties),
          },
        },
      };
    });
    const schema: ISchema = {
      type: 'object',
      properties: {
        ...itemSchema,
        storePolicy: {
          type: 'string',
          title: <TitleComponent data={'存储策略'} />,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择存储策略',
          },
          // required: true,
          default: 'default-column',
          'x-decorator-props': {
            // tooltip: '使用指定的存储策略来存储设备数据',
            gridSpan: 1,
            labelAlign: 'left',
            layout: 'vertical',
          },
          enum: storageList,
        },
      },
    };
    return (
      <PreviewText.Placeholder value="-" key={'config'}>
        <Form form={form} layout="vertical">
          <FormLayout>
            <SchemaField schema={schema} />
          </FormLayout>
          <Button
            type="primary"
            onClick={async () => {
              const values = (await form.submit()) as any;
              const { storePolicy, ...extra } = values;
              const resp = await productService.modify(id || '', {
                id,
                configuration: { ...extra },
                storePolicy: storePolicy,
              });
              if (resp.status === 200) {
                onlyMessage('操作成功！');
                if ((window as any).onTabSaveSuccess) {
                  if (resp.result) {
                    (window as any).onTabSaveSuccess(resp);
                    setTimeout(() => window.close(), 300);
                  }
                } else {
                  getDetailInfo();
                }
              }
            }}
          >
            保存
          </Button>
        </Form>
      </PreviewText.Placeholder>
    );
  };

  return (
    <div>
      {!visible ? (
        <div style={{ padding: '100px 0' }}>
          <Empty
            description={
              permission.update ? (
                <span>
                  请先
                  <Button
                    type="link"
                    onClick={() => {
                      setConfigVisible(true);
                    }}
                  >
                    选择
                  </Button>
                  设备接入网关，用以提供设备接入能力
                </span>
              ) : (
                '暂无权限，请联系管理员'
              )
            }
          />
        </div>
      ) : (
        <Row gutter={24}>
          <Col span={12}>
            <div className={styles.config}>
              <div className={styles.item}>
                <TitleComponent
                  data={
                    <span>
                      接入方式
                      <Tooltip
                        title={
                          !!(productModel.current?.count && productModel.current?.count > 0)
                            ? '产品下有设备实例时不能更换接入方式'
                            : ''
                        }
                      >
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          style={{ marginLeft: 20 }}
                          disabled={
                            !!(productModel.current?.count && productModel.current?.count > 0)
                          }
                          onClick={() => {
                            setConfigVisible(true);
                          }}
                        >
                          更换
                        </Button>
                      </Tooltip>
                    </span>
                  }
                />
                <div className={styles.context}>
                  <Tooltip placement="topLeft" title={access?.name}>
                    <div className="ellipsis-70">{access?.name}</div>
                  </Tooltip>
                </div>
                <div className={styles.context}>
                  <Tooltip
                    placement="topLeft"
                    title={
                      access?.description ||
                      dataSource.find((item) => item?.id === access?.provider)?.description
                    }
                  >
                    <div className="ellipsis-70">
                      {access?.description ||
                        dataSource.find((item) => item?.id === access?.provider)?.description}
                    </div>
                  </Tooltip>
                </div>
              </div>

              <div className={styles.item}>
                <TitleComponent data={'消息协议'} />
                <div className={styles.context}>{access?.protocolDetail?.name}</div>
                {config?.document && (
                  <div className={styles.context}>
                    <ReactMarkdown>{config?.document}</ReactMarkdown>
                  </div>
                )}
              </div>
              <div className={styles.item}>
                <TitleComponent data={'连接信息'} />
                {(access?.channelInfo?.addresses || []).length > 0
                  ? (access?.channelInfo?.addresses || []).map((item: any) => (
                      <div key={item.address}>
                        <Badge color={item.health === -1 ? 'red' : 'green'} text={item.address} />
                      </div>
                    ))
                  : '暂无连接信息'}
              </div>

              <div className={styles.item} id="driver-config">
                {renderConfigCard()}
              </div>
            </div>
          </Col>
          {config?.routes && config?.routes?.length > 0 && (
            <Col span={12}>
              <div className={styles.info}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: 10 }}>
                    {access?.provider === 'mqtt-server-gateway' ||
                    access?.provider === 'mqtt-client-gateway'
                      ? 'topic'
                      : 'URL信息'}
                  </div>
                  <Table
                    dataSource={config?.routes || []}
                    bordered
                    columns={config.id === 'MQTT' ? columnsMQTT : columnsHTTP}
                    pagination={false}
                    scroll={{ y: 500 }}
                  />
                </div>
              </div>
            </Col>
          )}
        </Row>
      )}
      {configVisible && (
        <AccessConfig
          close={() => {
            setConfigVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default Access;
