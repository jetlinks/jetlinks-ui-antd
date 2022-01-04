import { PageContainer } from '@ant-design/pro-layout';
import type { GatewayItem } from '@/pages/link/Gateway/typings';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { message, Popconfirm, Tooltip } from 'antd';
import {
  EditOutlined,
  MinusOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RedoOutlined,
  StopOutlined,
} from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import Service from '@/pages/link/Gateway/service';
import { CurdModel } from '@/components/BaseCrud/model';
import type { Field, FormPathPattern } from '@formily/core';
import { action } from '@formily/reactive';
import { onFieldReact, onFieldValueChange } from '@formily/core';
import { useAsyncDataSource } from '@/utils/util';

export const service = new Service('gateway/device');

const Gateway = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const handleAction = async (id: string, type: 'shutdown' | 'startup' | 'pause') => {
    const resp = await service.action(id, type);
    if (resp.status === 200) {
      message.success('操作成功！');
    } else {
      message.error('操作失败');
    }
    actionRef.current?.reload();
  };
  const columns: ProColumns<GatewayItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'name',
      sorter: 'true',
      defaultSortOrder: 'ascend',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'provider',
      title: intl.formatMessage({
        id: 'pages.link.type',
        defaultMessage: '类型',
      }),
    },
    {
      dataIndex: 'networkId',
      title: '网络组件',
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (text, record) => record.state.text,
    },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <a
          key="edit"
          onClick={() => {
            CurdModel.update(record);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        record.state.value === 'disabled' && (
          <a key="startup" onClick={() => handleAction(record.id, 'startup')}>
            <Tooltip title="启动">
              <PlayCircleOutlined />
            </Tooltip>
          </a>
        ),
        record.state.value === 'enabled' && (
          <a key="shutdown" onClick={() => handleAction(record.id, 'shutdown')}>
            <Tooltip title="停止">
              <StopOutlined />
            </Tooltip>
          </a>
        ),
        record.state.value === 'enabled' && (
          <a key="pause" onClick={() => handleAction(record.id, 'pause')}>
            <Tooltip title="暂停">
              <PauseCircleOutlined />
            </Tooltip>
          </a>
        ),
        record.state.value === 'paused' && (
          <a key="restart" onClick={() => handleAction(record.id, 'startup')}>
            <Tooltip title="恢复">
              <RedoOutlined />
            </Tooltip>
          </a>
        ),
        record.state.value === 'disabled' && (
          <a key="delete">
            <Popconfirm
              onConfirm={async () => {
                await service.remove(record.id);
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }}
              title={'确认删除？'}
            >
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.data.option.remove',
                  defaultMessage: '删除',
                })}
              >
                <MinusOutlined />
              </Tooltip>
            </Popconfirm>
          </a>
        ),
      ],
    },
  ];

  const getProviders = async () =>
    service
      .getProviders()
      .then((resp) =>
        resp.result.map((item: any) => ({ label: item.name, value: item.networkType?.value })),
      );

  const getProtocol = async () =>
    service.getProtocol().then((resp) =>
      resp.result.map((item: any) => ({
        label: item.name,
        value: item.id,
      })),
    );

  const getNetwork = async (id: string) =>
    service.getNetwork(id).then((resp) =>
      resp.result.map((item: any) => ({
        label: item.name,
        value: item.id,
      })),
    );

  const getAsyncData = (pattern: FormPathPattern, service2: (field: Field) => Promise<any>) => {
    onFieldReact(pattern, (field: any) => {
      field.loading = true;
      service2(field).then(
        action.bound!((resp) => {
          field.dataSource = resp;
          field.loading = false;
        }),
      );
    });
  };

  const formEffect = () => {
    getAsyncData('networkId', async (field) => {
      const value = field.query('provider').get('value');
      if (!value) return [];
      return getNetwork(value);
    });
    onFieldValueChange('provider', async (field) => {
      const network = field.query('networkId').take() as Field;
      network.value = undefined;
    });
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: '名称',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
      },
      provider: {
        title: '类型',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        'x-reactions': ['{{useAsyncDataSource(getProviders)}}'],
      },

      configuration: {
        type: 'object',
        properties: {
          routes: {
            title: '协议路由',
            type: 'array',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            'x-visible': false,
            items: {
              type: 'object',
              properties: {
                space: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    sort: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.SortHandle',
                    },
                    url: {
                      type: 'string',
                      title: 'url',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: '/**',
                      },
                    },
                    protocol: {
                      type: 'string',
                      title: '协议',
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-reactions': ['{{useAsyncDataSource(getProtocol)}}'],
                      'x-component-props': {
                        style: {
                          width: '250px',
                        },
                      },
                    },
                    remove: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.Remove',
                    },
                  },
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                title: '添加条目',
                'x-component': 'ArrayItems.Addition',
              },
            },
            'x-reactions': {
              dependencies: ['..provider'],
              fulfill: {
                state: {
                  visible: '{{["WEB_SOCKET_SERVER","HTTP_SERVER"].includes($deps[0])}}',
                },
              },
            },
          },
          protocol: {
            type: 'string',
            title: '消息协议',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-reactions': [
              '{{useAsyncDataSource(getProtocol)}}',
              {
                dependencies: ['..provider'],
                fulfill: {
                  state: {
                    visible:
                      '{{["UDP","COAP_SERVER","TCP_SERVER","MQTT_SERVER"].includes($deps[0])}}',
                    title: '{{$deps[0]==="MQTT_SERVER"?"认证协议":"消息协议"}}',
                  },
                },
              },
            ],
          },
          topics: {
            type: 'string',
            title: 'Topics',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-reactions': [
              {
                dependencies: ['..provider'],
                fulfill: {
                  state: {
                    visible: '{{["MQTT_CLIENT"].includes($deps[0])}}',
                  },
                },
              },
            ],
          },
          qos: {
            type: 'string',
            title: 'Qos',
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: [0, 1, 2],
            'x-reactions': [
              {
                dependencies: ['..provider'],
                fulfill: {
                  state: {
                    visible: '{{["MQTT_CLIENT"].includes($deps[0])}}',
                  },
                },
              },
            ],
          },
        },
      },

      networkId: {
        title: '网络组件',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
      },
      describe: {
        title: '描述',
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
        'x-component-props': {
          rows: 3,
        },
      },
    },
  };

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.link.gateway',
          defaultMessage: '设备网关',
        })}
        modelConfig={{
          width: '50vw',
        }}
        schema={schema}
        formEffect={formEffect}
        schemaConfig={{ scope: { getProviders, useAsyncDataSource, getProtocol, getNetwork } }}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Gateway;
