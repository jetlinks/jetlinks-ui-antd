import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { TenantDetail, TenantItem } from '@/pages/system/Tenant/typings';
import BaseCrud from '@/components/BaseCrud';
import { useRef } from 'react';
import { Avatar, Drawer, Tooltip } from 'antd';
import Service from '@/pages/system/Tenant/service';
import { EyeOutlined, KeyOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import moment from 'moment';
import { Link } from 'umi';
import TenantModel from '@/pages/system/Tenant/model';
import type { ISchema } from '@formily/json-schema';
import autzModel from '@/components/Authorization/autz';
import Authorization from '@/components/Authorization';
import { observer } from '@formily/react';

export const service = new Service('tenant');

const Tenant = observer(() => {
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
      valueEnum: {
        default: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.all',
            defaultMessage: '全部',
          }),
          status: 'Default',
        },
        '1': {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.normal',
            defaultMessage: '正常',
          }),
          status: '1',
        },
        '0': {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.disable',
            defaultMessage: '禁用',
          }),
          status: '0',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.tenant.createTime',
        defaultMessage: '创建时间',
      }),
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

        <a
          key="auth"
          onClick={() => {
            autzModel.autzTarget.id = record.tenant.id!;
            autzModel.autzTarget.name = record.tenant.name!;
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
      <Drawer
        maskClosable={false}
        title={intl.formatMessage({
          id: 'pages.data.option.authorize',
          defaultMessage: '授权',
        })}
        width="50vw"
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
          type={'tenant'}
        />
      </Drawer>
    </PageContainer>
  );
});
export default Tenant;
