import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import type { TenantDetail } from '@/pages/system/Tenant/typings';
import type { TenantItem } from '@/pages/system/Tenant/typings';
import BaseCrud from '@/components/BaseCrud';
import { useRef } from 'react';
import { Avatar, Menu, message, Popconfirm, Tooltip } from 'antd';
import Service from '@/pages/system/Tenant/service';
import { CurdModel } from '@/components/BaseCrud/model';
import {
  CloseCircleOutlined,
  EditOutlined,
  KeyOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
);
const service = new Service('tenant');
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
    },
    {
      dataIndex: 'members',
      title: intl.formatMessage({
        id: 'pages.system.tenant.members',
        defaultMessage: '成员数',
      }),
      align: 'center',
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

  return (
    <PageContainer>
      <BaseCrud<TenantItem>
        request={(params = {}) => service.queryDetail(params)}
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.system.tenant.list',
          defaultMessage: '租户列表',
        })}
        schema={{}}
        menu={menu}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Tenant;
