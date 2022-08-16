import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, message, Popconfirm, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { NetworkItem } from '@/pages/link/Type/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
// import { history } from 'umi';
import useHistory from '@/hooks/route/useHistory';
import Service from '@/pages/link/service';
import { PermissionButton, ProTableCard } from '@/components';
import NetworkCard from '@/components/ProTableCard/CardItems/networkCard';
import usePermissions from '@/hooks/permission';
import { onlyMessage } from '@/utils/util';

export const service = new Service('network/config');

export const networkMap = {
  UDP: 'udp://',
  TCP_SERVER: 'tcp://',
  WEB_SOCKET_SERVER: 'ws://',
  MQTT_CLIENT: 'mqtt://',
  HTTP_SERVER: 'http://',
  MQTT_SERVER: 'mqtt://',
  COAP_SERVER: 'coap://',
};

const Network = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const history = useHistory();

  const { permission: networkPermission } = usePermissions('link/Type');
  /**
   * 跳转详情页
   * @param id
   */
  const pageJump = (id?: string) => {
    // 跳转详情
    history.push(`${getMenuPathByParams(MENUS_CODE['link/Type/Detail'], id)}`);
  };
  const columns: ProColumns<NetworkItem>[] = [
    {
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
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
      valueType: 'select',
      request: () =>
        service.getSupports().then((resp) =>
          resp.result.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        ),
    },
    {
      dataIndex: 'shareCluster',
      title: '集群',
      renderText: (text) => (text ? '共享配置' : '独立配置'),
      valueType: 'select',
      valueEnum: {
        true: {
          text: '共享配置',
          status: true,
        },
        false: {
          text: '独立配置',
          status: false,
        },
      },
    },
    {
      dataIndex: 'configuration',
      title: '详情',
      ellipsis: true,
      hideInSearch: true,
      renderText: (text, record) => {
        if (record.shareCluster) {
          const host = record.configuration?.publicHost || record.configuration?.remoteHost;
          const port = record.configuration?.publicPort || record.configuration?.remotePort;
          return host ? (
            <>
              {networkMap[record.type]}
              {host}:{port}
            </>
          ) : null;
        } else {
          const log = record.cluster?.map(
            (item) =>
              `${item.configuration?.publicHost || item.configuration?.remoteHost}:${
                item.configuration?.publicPort || item.configuration?.remotePort
              }`,
          );
          return (
            <>
              {log.map((item) => (
                <div key={item}>
                  {networkMap[record.type]}
                  {item}
                </div>
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
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: '禁用',
          status: 'disabled',
        },
        enabled: {
          text: '正常',
          status: 'enabled',
        },
      },
      render: (text, record) => {
        if (record.state.value === 'enabled') {
          return <Badge color="#52c41a" text="正常" />;
        }
        return <Badge color="red" text="禁用" />;
      },
    },
    {
      dataIndex: 'description',
      title: '说明',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          type="link"
          isPermission={
            networkPermission.view || networkPermission.update || networkPermission.action
          }
          style={{ padding: 0 }}
          key="view"
          onClick={() => {
            const url = `${getMenuPathByParams(MENUS_CODE['link/Type/Detail'], record.id)}`;
            history.push(url, { view: true });
          }}
        >
          <Tooltip title="查看">
            <EyeOutlined />
          </Tooltip>
        </PermissionButton>,
        <PermissionButton
          type="link"
          isPermission={networkPermission.update}
          style={{ padding: 0 }}
          // disabled={getButtonPermission('link/Type', ['view'])}
          key="edit"
          onClick={() => {
            // Store.set('current-network-data', record);
            pageJump(record.id);
          }}
        >
          <Tooltip title="编辑">
            <EditOutlined />
          </Tooltip>
        </PermissionButton>,

        <PermissionButton
          type="link"
          style={{ padding: 0 }}
          isPermission={networkPermission.action}
          key="changeState"
        >
          <Popconfirm
            title={`确认${record.state.value === 'enabled' ? '禁用' : '启用'}?`}
            onConfirm={async () => {
              const map = {
                disabled: 'start',
                enabled: 'shutdown',
              };
              await service.changeState(record.id, map[record.state.value]);
              onlyMessage(
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
        </PermissionButton>,
        <PermissionButton
          type="link"
          key={'delete'}
          style={{ padding: 0 }}
          isPermission={networkPermission.delete}
          disabled={record.state.value === 'enabled'}
          tooltip={{
            title:
              record.state.value === 'disabled'
                ? intl.formatMessage({
                    id: 'pages.data.option.remove',
                    defaultMessage: '删除',
                  })
                : '请先禁用该组件，再删除。',
          }}
        >
          <Popconfirm
            title="确认删除?"
            onConfirm={async () => {
              const response: any = await service.remove(record.id);
              if (response.status === 200) {
                onlyMessage('删除成功');
                actionRef.current?.reload();
              } else {
                message.error(response?.message || '删除失败');
              }
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
        </PermissionButton>,
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
      <ProTableCard<NetworkItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        scroll={{ x: 1366 }}
        search={false}
        columnEmptyText={''}
        headerTitle={
          <PermissionButton
            isPermission={networkPermission.add}
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
          </PermissionButton>
        }
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        gridColumn={3}
        cardRender={(record) => (
          <NetworkCard
            {...record}
            detail={
              <PermissionButton
                type="link"
                isPermission={
                  networkPermission.view || networkPermission.update || networkPermission.action
                }
                style={{ padding: 0, fontSize: 24, color: '#fff' }}
                key="view"
                onClick={() => {
                  const url = `${getMenuPathByParams(MENUS_CODE['link/Type/Detail'], record.id)}`;
                  history.push(url, { view: true });
                }}
              >
                <EyeOutlined />
              </PermissionButton>
            }
            actions={[
              <PermissionButton
                isPermission={networkPermission.update}
                key="edit"
                onClick={() => {
                  // Store.set('current-network-data', record);
                  pageJump(record.id);
                }}
              >
                <EditOutlined />
                编辑
              </PermissionButton>,
              <PermissionButton
                isPermission={networkPermission.action}
                key="changeState"
                popConfirm={{
                  title: `确认${record.state.value === 'enabled' ? '禁用' : '启用'}?`,
                  onConfirm: async () => {
                    const map = {
                      disabled: 'start',
                      enabled: 'shutdown',
                    };
                    await service.changeState(record.id, map[record.state.value]);
                    onlyMessage(
                      intl.formatMessage({
                        id: 'pages.data.option.success',
                        defaultMessage: '操作成功!',
                      }),
                    );
                    actionRef.current?.reload();
                  },
                }}
              >
                {record.state.value === 'enabled' ? (
                  <CloseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )}
                {record.state.value === 'enabled' ? '禁用' : '启用'}
              </PermissionButton>,
              <PermissionButton
                type="link"
                key="delete"
                style={{ padding: 0 }}
                isPermission={networkPermission.delete}
                disabled={record.state.value === 'enabled'}
                tooltip={{
                  title:
                    record.state.value === 'disabled'
                      ? intl.formatMessage({
                          id: 'pages.data.option.remove',
                          defaultMessage: '删除',
                        })
                      : '请先禁用该组件，再删除。',
                }}
                popConfirm={{
                  title: '确认删除?',
                  onConfirm: async () => {
                    const response: any = await service.remove(record.id);
                    if (response.status === 200) {
                      onlyMessage('删除成功');
                      actionRef.current?.reload();
                    } else {
                      message.error(response?.message || '删除失败');
                    }
                  },
                }}
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
      />
    </PageContainer>
  );
};

export default Network;
