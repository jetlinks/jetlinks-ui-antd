import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
import {
  EditOutlined,
  KeyOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Menu, Tooltip, Popconfirm, message } from 'antd';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import BaseCrud from '@/components/BaseCrud';
import { CurdModel } from '@/components/BaseCrud/model';
import BaseService from '@/utils/BaseService';

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
);

export const service = new BaseService<UserItem>('user');
const User: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.user.name',
        defaultMessage: '姓名',
      }),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      align: 'center',
      tip: '姓名过长会自动收缩',
      sorter: true,
      defaultSortOrder: 'ascend',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.user.username',
        defaultMessage: '用户名',
      }),
      dataIndex: 'username',
      copyable: true,
      ellipsis: true,
      align: 'center',
      tip: '用户名过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      search: {
        transform: (value) => ({ username$LIKE: value }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.user.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      filters: true,
      align: 'center',
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        1: {
          text: '正常',
          status: 1,
        },
        0: {
          text: '禁用',
          status: 0,
        },
      },
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
              id: 'pages.data.option.disable.tips',
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
                id: `pages.data.option.${record.status ? 'disable' : 'enable'}`,
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
      name: {
        title: intl.formatMessage({
          id: 'pages.system.user.name',
          defaultMessage: '姓名',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'name',
        required: true,
        _designableId: '1jq1ln7nzji',
        'x-index': 0,
      },
      username: {
        title: intl.formatMessage({
          id: 'pages.system.user.username',
          defaultMessage: '用户名',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'username',
        required: true,
        _designableId: '9vf50ad9n1h',
        'x-index': 1,
      },
      password: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.system.user.password',
          defaultMessage: '密码',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Password',
        'x-component-props': {
          checkStrength: true,
        },
        'x-reactions': [
          {
            dependencies: ['.confirmPassword'],
            fulfill: {
              state: {
                errors:
                  '{{$deps[0] && $self.value && $self.value !==$deps[0] ? "确认密码不匹配" : ""}}',
              },
            },
          },
        ],
        'x-decorator-props': {},
        name: 'password',
        required: false,
        _designableId: 'weg6kt6izlt',
        'x-index': 2,
      },
      confirmPassword: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.system.user.confirmPassword',
          defaultMessage: '确认密码？',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Password',
        'x-component-props': {
          checkStrength: true,
        },
        'x-reactions': [
          {
            dependencies: ['.password'],
            fulfill: {
              state: {
                errors:
                  '{{$deps[0] && $self.value && $self.value !== $deps[0] ? "确认密码不匹配" : ""}}',
              },
            },
          },
        ],
        'x-decorator-props': {},
        name: 'confirmPassword',
        required: false,
        _designableId: 'mhsm2fk573e',
        'x-index': 3,
      },
    },
    _designableId: 'zd740kqp5hf',
  };

  return (
    <PageContainer>
      <BaseCrud<UserItem>
        actionRef={actionRef}
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.system.user',
          defaultMessage: '用户管理',
        })}
        menu={menu}
        schema={schema}
      />
    </PageContainer>
  );
};

export default User;
