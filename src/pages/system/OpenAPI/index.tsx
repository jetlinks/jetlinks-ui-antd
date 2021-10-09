import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import type { OpenApiItem } from '@/pages/system/OpenAPI/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import { CurdModel } from '@/components/BaseCrud/model';
import { Drawer, message, Popconfirm, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  EditOutlined,
  KeyOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import BaseService from '@/utils/BaseService';
import autzModel from '@/components/Authorization/autz';
import Authorization from '@/components/Authorization';
import { observer } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import _ from 'lodash';

const service = new BaseService<OpenApiItem>('open-api');
const OpenAPI: React.FC = observer(() => {
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
      sorter: true,
      defaultSortOrder: 'ascend',
      width: 200,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'clientName',
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
        <a
          key="editable"
          onClick={() => {
            const temp = _.omit(record, ['createTime', 'creatorId', 'status']);
            CurdModel.update(temp);
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
        <a
          key="auth"
          onClick={() => {
            autzModel.autzTarget.id = record.id;
            autzModel.autzTarget.name = record.clientName;
            autzModel.visible = true;
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.authorize',
              defaultMessage: '授权',
            })}
          >
            <KeyOutlined />
          </Tooltip>
        </a>,
        <a key="state">
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

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
        },
        properties: {
          clientName: {
            title: intl.formatMessage({
              id: 'pages.table.name',
              defaultMessage: '名称',
            }),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            name: 'clientName',
          },
          enableOAuth2: {
            type: 'boolean',
            title: 'OAuth2',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            name: 'enableOAuth2',
          },
          id: {
            title: 'clientId',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            name: 'clientId',
          },
          secureKey: {
            title: 'secureKey',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
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
            'x-decorator-props': {
              labelWrap: false,
              wrapperWrap: false,
              labelCol: 6,
              wrapperCol: 18,
            },
            name: 'username',
          },
          password: {
            title: intl.formatMessage({
              id: 'pages.system.openApi.password',
              defaultMessage: '密码',
            }),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              labelCol: 6,
              wrapperCol: 18,
            },
            name: 'password',
          },
          redirectUrl: {
            title: 'redirectUrl',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-visible': false,
            'x-decorator-props': {
              fullness: false,
              gridSpan: 2,
              labelAlign: 'right',
              wrapperAlign: 'left',
              labelCol: 3,
              wrapperCol: 21,
            },
            name: 'redirectUrl',
            'x-reactions': {
              dependencies: [
                {
                  property: 'value',
                  source: '.enableOAuth2',
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
      },
    },
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
      <Drawer
        title="授权"
        width="70vw"
        visible={autzModel.visible}
        onClose={() => {
          autzModel.visible = false;
        }}
      >
        <Authorization
          close={() => {
            autzModel.visible = false;
          }}
          target={autzModel.autzTarget}
        />
      </Drawer>
    </PageContainer>
  );
});

export default OpenAPI;
