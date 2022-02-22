import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
import { EditOutlined, MinusOutlined } from '@ant-design/icons';
import { Card, message, Popconfirm, Tooltip } from 'antd';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import BaseCrud from '@/components/BaseCrud';
import BaseService from '@/utils/BaseService';
import { useIntl } from '@@/plugin-locale/localeExports';
import { observer } from '@formily/react';
// import autzModel from '@/components/Authorization/autz';
// import Authorization from '@/components/Authorization';
// import { BindModel } from '@/components/BindUser/model';
// import BindUser from '@/components/BindUser';
import { Link } from 'umi';
import SearchComponent from '@/components/SearchComponent';

export const service = new BaseService<RoleItem>('role');

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
      dataIndex: 'description',
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
        <Link to={`/system/role/edit/${record.id}`} key="link">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
            key={'edit'}
          >
            <EditOutlined />
          </Tooltip>
        </Link>,
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
      description: {
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
    },
  };

  return (
    <PageContainer>
      <Card style={{ marginBottom: '20px' }}>
        <SearchComponent<RoleItem>
          field={columns}
          onSearch={async (data) => {
            message.success(JSON.stringify(data));
          }}
          target="role-search"
        />
      </Card>
      <BaseCrud<RoleItem>
        actionRef={actionRef}
        columns={columns}
        service={service}
        search={false}
        title={intl.formatMessage({
          id: 'pages.system.role',
          defaultMessage: '角色管理',
        })}
        schema={schema}
        // defaultParams={{ typeId: 'role' }}
      />
      {/* <Modal
        visible={BindModel.visible}
        closable={false}
        onCancel={() => {
          BindModel.visible = false;
          BindModel.bind = false;
        }}
        width={BindModel.bind ? '90vw' : '60vw'}
      >
        <BindUser />
      </Modal> */}
      {/* <Drawer
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
      </Drawer> */}
    </PageContainer>
  );
});
export default Role;
