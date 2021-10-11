import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
import { EditOutlined, KeyOutlined, MinusOutlined, UserAddOutlined } from '@ant-design/icons';
import { Drawer, message, Modal, Popconfirm, Tooltip } from 'antd';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import BaseCrud from '@/components/BaseCrud';
import { CurdModel } from '@/components/BaseCrud/model';
import BaseService from '@/utils/BaseService';
import { useIntl } from '@@/plugin-locale/localeExports';
import { observer } from '@formily/react';
import autzModel from '@/components/Authorization/autz';
import Authorization from '@/components/Authorization';
import { BindModel } from '@/components/BindUser/model';
import BindUser from '@/components/BindUser';

const service = new BaseService<RoleItem>('dimension');

const Role: React.FC = observer(() => {
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
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: intl.formatMessage({
        id: 'pages.system.userName.tips',
        defaultMessage: '用户名过长会自动收缩',
      }),
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
        id: 'pages.table.describe',
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
        <a
          key="autz"
          onClick={() => {
            autzModel.autzTarget.id = record.id;
            autzModel.autzTarget.name = record.name;
            autzModel.autzTarget.type = 'role';
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

        <a
          key="bind"
          onClick={() => {
            BindModel.dimension = {
              id: record.id,
              name: record.name,
              type: 'role',
            };
            BindModel.visible = true;
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
        <a key="delete">
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
        'x-component-props': {
          disabled: CurdModel.model === 'edit',
        },
        'x-decorator-props': {},
        name: 'id',
        required: true,
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '角色名称',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'name',
        required: true,
      },
      describe: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.table.describe',
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
        schema={schema}
        defaultParams={{ typeId: 'role' }}
      />
      <Modal
        visible={BindModel.visible}
        closable={false}
        onCancel={() => {
          BindModel.visible = false;
          BindModel.bind = false;
        }}
        width={BindModel.bind ? '90vw' : '60vw'}
      >
        <BindUser />
      </Modal>
      <Drawer
        title={intl.formatMessage({
          id: 'pages.data.option.authorize',
          defaultMessage: '授权',
        })}
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
export default Role;
