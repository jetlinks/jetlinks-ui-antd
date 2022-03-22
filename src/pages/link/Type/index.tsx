import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Badge, Button, message, Popconfirm, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { NetworkItem } from '@/pages/link/Type/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { history } from 'umi';
import Service from '@/pages/link/service';
import { Store } from 'jetlinks-store';

export const service = new Service('network/config');

/**
 * 跳转详情页
 * @param id
 */
const pageJump = (id?: string) => {
  // 跳转详情
  history.push(`${getMenuPathByParams(MENUS_CODE['link/Type/Save'], id)}`);
};

const Network = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<NetworkItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'type',
      title: intl.formatMessage({
        id: 'pages.link.type',
        defaultMessage: '类型',
      }),
    },
    {
      dataIndex: 'shareCluster',
      title: '集群',
      renderText: (text) => (text ? '共享配置' : '独立配置'),
    },
    {
      dataIndex: 'configuration',
      title: '详情',
      renderText: (text, record) => {
        if (record.shareCluster) {
          const publicHost = record.configuration.publicHost;
          const publicPort = record.configuration.publicPort;
          return (
            <>
              公网: {publicHost}:{publicPort}
            </>
          );
        } else {
          const publicHost = record.cluster?.[0]?.configuration?.publicHost;
          const publicPort = record.cluster?.[0]?.configuration?.publicPort;
          return (
            <>
              公网: {publicHost}:{publicPort}
            </>
          );
        }
      },
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (text, record) => {
        if (record.state.value === 'disabled') {
          return <Badge color="lime" text="正常" />;
        }
        return <Badge color="red" text="禁用" />;
      },
    },
    {
      dataIndex: 'description',
      title: '说明',
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
            Store.set('current-network-data', record);
            pageJump(record.id);
          }}
        >
          <Tooltip title="查看">
            <EyeOutlined />
          </Tooltip>
        </a>,
        <a key="delete">
          <Popconfirm
            title="确认删除?"
            onConfirm={async () => {
              const response: any = await service.remove(record.id);
              if (response.status === 200) {
                message.success('删除成功');
                actionRef.current?.reload();
              }
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.data.option.remove',
                defaultMessage: '删除',
              })}
            >
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
        <a key="changeState">
          <Popconfirm
            title={intl.formatMessage({
              id: `pages.data.option.${record.state.value}.tips`,
              defaultMessage: `确认${record.state.value === 'enabled' ? '禁用' : '启用'}?`,
            })}
            onConfirm={async () => {
              // await service.update({
              //   id: record.id,
              //   status: record.status ? 0 : 1,
              // });
              const map = {
                disabled: 'start',
                enabled: 'shutdown',
              };
              await service.changeState(record.id, map[record.state.value]);
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
                id: `pages.data.option.${record.state.value}`,
                defaultMessage: record.state.value === 'enabled' ? '禁用' : '启用',
              })}
            >
              {record.state.value === 'disabled' ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const [param, setParam] = useState({});

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<NetworkItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        headerTitle={'网络组件'}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        toolBarRender={() => [
          <Button
            onClick={() => {
              pageJump();
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default Network;
