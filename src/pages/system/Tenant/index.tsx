import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import type { TenantDetail } from '@/pages/system/Tenant/typings';
import type { TenantItem } from '@/pages/system/Tenant/typings';
import BaseCrud from '@/components/BaseCrud';
import { useRef } from 'react';
import { Avatar, message, Popconfirm, Tooltip } from 'antd';
import Service from '@/pages/system/Tenant/service';
import {
  CloseCircleOutlined,
  EyeOutlined,
  KeyOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import moment from 'moment';
import { Link } from 'umi';
import TenantModel from '@/pages/system/Tenant/model';
import type { ISchema } from '@formily/json-schema';

export const service = new Service('tenant');

const Tenant = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TenantItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'tenant',
      title: intl.formatMessage({
        id: 'pages.system.tenant.avatar',
        defaultMessage: '头像',
      }),
      align: 'center',
      search: false,
      renderText: (text: TenantDetail) => <Avatar src={text.photo} />,
    },
    {
      dataIndex: 'tenant',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      align: 'center',
      renderText: (text: TenantDetail) => text.name,
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'members',
      title: intl.formatMessage({
        id: 'pages.system.tenant.members',
        defaultMessage: '成员数',
      }),
      align: 'center',
      search: false,
    },
    {
      dataIndex: 'tenant',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      align: 'center',
      renderText: (text: TenantDetail) => text.state.text,
      valueType: 'select',
      hideInForm: true,
      onFilter: true,
      search: false,
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
      title: '创建时间',
      dataIndex: 'tenant',
      width: '200px',
      align: 'center',
      renderText: (record: TenantDetail) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      search: false,
      defaultSortOrder: 'descend',
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
        <Link
          onClick={() => {
            TenantModel.current = record;
          }}
          to={`/system/tenant/detail/${record.tenant.id}`}
          key="link"
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.detail',
              defaultMessage: '查看',
            })}
            key={'detail'}
          >
            <EyeOutlined />
          </Tooltip>
        </Link>,

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
        <a href={record.tenant.id} target="_blank" rel="noopener noreferrer" key="view">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.disabled.tips',
              defaultMessage: '确认禁用？',
            })}
            onConfirm={async () => {
              await service.update({
                tenant: {
                  id: record.tenant.id,
                  state: record.tenant?.state.value ? 0 : 1,
                },
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
                id: `pages.data.option.${record.tenant?.state.value ? 'disabled' : 'enabled'}`,
                defaultMessage: record.tenant?.state?.value ? '禁用' : '启用',
              })}
            >
              {record.tenant?.state.value ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      username: {
        type: 'string',
        title: '用户名',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      password: {
        type: 'string',
        title: '密码',
        required: true,
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
                selfErrors:
                  '{{$deps[0] && $self.value && $self.value !== $deps[0] ? "确认密码不匹配" : ""}}',
              },
            },
          },
        ],
      },
      confirmPassword: {
        type: 'string',
        title: '确认密码',
        required: true,
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
                selfErrors:
                  '{{$deps[0] && $self.value && $self.value !== $deps[0] ? "确认密码不匹配" : ""}}',
              },
            },
          },
        ],
      },
      description: {
        type: 'string',
        title: '备注',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  };

  return (
    <PageContainer>
      <BaseCrud<TenantItem>
        request={(params = {}) => service.queryList(params)}
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.system.tenant.list',
          defaultMessage: '租户列表',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Tenant;
