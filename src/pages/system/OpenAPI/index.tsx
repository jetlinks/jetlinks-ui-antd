import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import type { OpenApiItem } from '@/pages/system/OpenAPI/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import { CurdModel } from '@/components/BaseCrud/model';
import { message, Popconfirm, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  EditOutlined,
  KeyOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import BaseService from '@/utils/BaseService';

const service = new BaseService<OpenApiItem>('open-api');
const OpenAPI: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<OpenApiItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'clientId',
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'Name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.username',
        defaultMessage: '用户名',
      }),
      dataIndex: 'username',
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      filters: true,
      align: 'center',
      renderText: (text: any) => text.text,
      valueType: 'select',
      hideInForm: true,
      onFilter: true,
      valueEnum: [
        {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.all',
            defaultMessage: '全部',
          }),
          status: 'Default',
        },
        {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.normal',
            defaultMessage: '正常',
          }),
          status: '1',
        },
        {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.disable',
            defaultMessage: '禁用',
          }),
          status: '0',
        },
      ],
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
        <a key="editable" onClick={() => CurdModel.update(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a onClick={() => console.log('授权')}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.authorize',
              defaultMessage: '授权',
            })}
          >
            <KeyOutlined />
          </Tooltip>
        </a>,
        <a href={record.id} target="_blank" rel="noopener noreferrer" key="view">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.disabled.tips',
              defaultMessage: '确认禁用？',
            })}
            onConfirm={async () => {
              await service.update({
                id: record.id,
                status: record.status ? 0 : 1,
              });
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: `pages.data.option.${record.status ? 'disabled' : 'enabled'}`,
                defaultMessage: record.status ? '禁用' : '启用',
              })}
            >
              {record.status ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const schema = {
    type: 'object',
    properties: {
      oy139sts87c: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
        },
        'x-decorator-props': {},
        _designableId: 'oy139sts87c',
        'x-index': 0,
        name: 'oy139sts87c',
        properties: {
          clientName: {
            title: intl.formatMessage({
              id: 'pages.table.name',
              defaultMessage: '名称',
            }),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {},
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            _designableId: 'nke56so9n3l',
            'x-index': 0,
            name: 'clientName',
          },
          enableOAuth2: {
            type: 'boolean',
            title: 'OAuth2',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {},
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            _designableId: 'czwwqejzeps',
            'x-index': 1,
            name: 'enableOAuth2',
          },
          clientId: {
            title: 'clientId',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {},
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            _designableId: 'dcwl7x7e6q4',
            'x-index': 2,
            name: 'clientId',
          },
          secureKey: {
            title: 'secureKey',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {},
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            _designableId: 'npbrt1asayi',
            'x-index': 3,
            name: 'secureKey',
          },
          username: {
            title: intl.formatMessage({
              id: 'pages.table.username',
              defaultMessage: '用户名',
            }),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {},
            'x-decorator-props': {
              labelWrap: false,
              wrapperWrap: false,
              labelCol: 6,
              wrapperCol: 18,
            },
            _designableId: 'wu5jed7kzrk',
            'x-index': 4,
            name: 'username',
          },
          password: {
            title: intl.formatMessage({
              id: 'pages.system.openApi.passWord',
              defaultMessage: '密码',
            }),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {},
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            _designableId: 'au7sgavkj8o',
            'x-index': 5,
            name: 'password',
          },
          redirectUrl: {
            title: 'redirectUrl',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {},
            'x-decorator-props': {
              fullness: false,
              gridSpan: 2,
              labelAlign: 'right',
              wrapperAlign: 'left',
              labelCol: 3,
              wrapperCol: 21,
            },
            _designableId: 'jr9ye81b03p',
            'x-index': 6,
            name: 'redirectUrl',
            'x-reactions': {
              dependencies: [
                {
                  property: 'value',
                  type: 'any',
                  source: 'oy139sts87c.enableOAuth2',
                  name: 'enableOAuth2',
                },
              ],
              fulfill: {
                state: {
                  visible: '{{$deps.enableOAuth2}}',
                },
              },
            },
          },
        },
      },
      ipWhiteList: {
        title: intl.formatMessage({
          id: 'pages.system.openApi.ipWhileList',
          defaultMessage: 'IP白名单',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {},
        'x-decorator-props': {
          labelCol: 3,
          wrapperCol: 21,
        },
        name: 'ipWhiteList',
        _designableId: 'g2xv6coqilq',
        'x-index': 1,
      },
      description: {
        title: intl.formatMessage({
          id: 'pages.table.describe',
          defaultMessage: '描述',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {},
        'x-decorator-props': {
          labelCol: 3,
          wrapperCol: 21,
        },
        name: 'description',
        _designableId: 'j0t2lxx6k3r',
        'x-index': 2,
      },
    },
    _designableId: 'wmcf6s4ssie',
  };

  return (
    <PageContainer>
      <BaseCrud<OpenApiItem>
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.system.openApi',
          defaultMessage: '第三方平台',
        })}
        schema={schema}
        modelConfig={{ width: 900 }}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};

export default OpenAPI;
