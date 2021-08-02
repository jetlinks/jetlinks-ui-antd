import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
import { EditOutlined, KeyOutlined, MinusOutlined, UserAddOutlined } from '@ant-design/icons';
import { Menu, message, Popconfirm, Tooltip } from 'antd';
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

const service = new BaseService<RoleItem>('dimension');

const Role: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<RoleItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.role.id',
        defaultMessage: '标识',
      }),
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.role.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: '名称过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.role.describe',
        defaultMessage: '描述',
      }),
      dataIndex: 'describe',
      filters: true,
      onFilter: true,
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

        <a
          onClick={() => {
            console.log('绑定用户');
            actionRef.current?.reload();
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.system.role.option.bindUser',
              defaultMessage: '绑定用户',
            })}
          >
            <UserAddOutlined />
          </Tooltip>
        </a>,
        <a>
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.remove.tips',
              defaultMessage: '确认删除？',
            })}
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
        </a>,
      ],
    },
  ];

  const schema = {
    type: 'object',
    properties: {
      id: {
        title: intl.formatMessage({
          id: 'pages.system.role.id',
          defaultMessage: '角色标识',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'id',
        required: true,
        _designableId: '1jq1ln7nzji',
        'x-index': 0,
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.system.role.name',
          defaultMessage: '角色名称',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'name',
        required: true,
        _designableId: '9vf50ad9n1h',
        'x-index': 1,
      },
      describe: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.system.role.describe',
          defaultMessage: '描述',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          checkStrength: true,
        },
        'x-decorator-props': {},
        name: 'password',
        required: false,
        _designableId: 'weg6kt6izlt',
        'x-index': 2,
      },
      typeId: {
        type: 'string',
        'x-visible': false,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        name: 'typeId',
        default: 'role',
      },
    },
    _designableId: 'zd740kqp5hf',
  };

  return (
    <PageContainer>
      <BaseCrud<RoleItem>
        actionRef={actionRef}
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.system.role',
          defaultMessage: '角色管理',
        })}
        menu={menu}
        schema={schema}
        defaultParams={{ typeId: 'role' }}
      />
    </PageContainer>
  );
};
export default Role;
