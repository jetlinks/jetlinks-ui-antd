import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Badge, Button, message, Popconfirm, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { NetworkItem } from '@/pages/link/Type/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { getButtonPermission, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
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
  history.push(`${getMenuPathByParams(MENUS_CODE['link/Type/Detail'], id)}`);
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
          const log = record.cluster?.map(
            (item) => `${item.configuration.publicHost}:${item.configuration.publicPort}`,
          );
          return (
            <>
              {log.map((item) => (
                <div key={item}>公网:{item}</div>
              ))}
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
        if (record.state.value === 'enabled') {
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
      width: 200,
      render: (text, record) => [
        <Button
          type="link"
          style={{ padding: 0 }}
          // disabled={getButtonPermission('link/Type', ['view'])}
          key="edit"
          onClick={() => {
            Store.set('current-network-data', record);
            pageJump(record.id);
          }}
        >
          <Tooltip title="查看">
            <EditOutlined />
          </Tooltip>
        </Button>,

        <Button
          type="link"
          style={{ padding: 0 }}
          disabled={getButtonPermission('link/Type', ['action'])}
          key="changeState"
        >
          <Popconfirm
            title={`确认${record.state.value === 'enabled' ? '禁用' : '启用'}?`}
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
            <Tooltip title={record.state.value === 'enabled' ? '禁用' : '启用'}>
              {record.state.value === 'enabled' ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </Button>,
        <Button
          type="link"
          style={{ padding: 0 }}
          disabled={
            record.state.value === 'enabled' || getButtonPermission('link/Type', ['delete'])
          }
        >
          <Tooltip
            key="delete"
            title={
              record.state.value === 'disabled'
                ? intl.formatMessage({
                    id: 'pages.data.option.remove',
                    defaultMessage: '删除',
                  })
                : '请先禁用该组件，再删除。'
            }
          >
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
              <DeleteOutlined />
            </Popconfirm>
          </Tooltip>
        </Button>,
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
        headerTitle={
          <Button
            disabled={getButtonPermission('link/Type', ['add'])}
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
          </Button>
        }
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
      />
    </PageContainer>
  );
};

export default Network;
