import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import moment from 'moment';
import { Badge, Button, Dropdown, Menu, message, Popconfirm, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useHistory } from 'umi';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  ImportOutlined,
  PlusOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { model } from '@formily/reactive';
import Service from '@/pages/device/Instance/service';
import type { MetadataItem } from '@/pages/device/Product/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import Save from './Save';
import Export from './Export';
import Import from './Import';
import Process from './Process';
import SearchComponent from '@/components/SearchComponent';
import { ProTableCard } from '@/components';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import DeviceCard from '@/components/ProTableCard/CardItems/device';
import { getButtonPermission, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';

export const statusMap = new Map();
statusMap.set('在线', 'success');
statusMap.set('离线', 'error');
statusMap.set('未激活', 'processing');
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'processing');

export const InstanceModel = model<{
  current: Partial<DeviceInstance>;
  detail: Partial<DeviceInstance>;
  config: any;
  metadataItem: MetadataItem;
  params: Set<string>; // 处理无限循环Card
  active?: string; // 当前编辑的Card
}>({
  current: {},
  detail: {},
  config: {},
  metadataItem: {},
  params: new Set<string>(['test']),
});
export const service = new Service('device/instance');
const Instance = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [operationVisible, setOperationVisible] = useState<boolean>(false);
  const [type, setType] = useState<'active' | 'sync'>('active');
  const [api, setApi] = useState<string>('');
  const [current, setCurrent] = useState<Partial<DeviceInstance>>({});
  const [searchParams, setSearchParams] = useState<any>({});
  const [bindKeys, setBindKeys] = useState<any[]>([]);
  const history = useHistory<Record<string, string>>();
  const intl = useIntl();

  const tools = (record: DeviceInstance) => [
    <Button
      type={'link'}
      style={{ padding: 0 }}
      onClick={() => {
        InstanceModel.current = record;
        const url = getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], record.id);
        history.push(url);
      }}
      disabled={getButtonPermission('device/Instance', ['view'])}
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
    </Button>,
    <Button
      type={'link'}
      style={{ padding: 0 }}
      disabled={getButtonPermission('device/Product', ['action'])}
    >
      <Popconfirm
        key={'state'}
        title={intl.formatMessage({
          id: `pages.data.option.${
            record.state.value !== 'notActive' ? 'disabled' : 'enabled'
          }.tips`,
          defaultMessage: '确认禁用？',
        })}
        onConfirm={async () => {
          if (record.state.value !== 'notActive') {
            await service.undeployDevice(record.id);
          } else {
            await service.deployDevice(record.id);
          }
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
            id: `pages.data.option.${record.state.value !== 'notActive' ? 'disabled' : 'enabled'}`,
            defaultMessage: record.state.value !== 'notActive' ? '禁用' : '启用',
          })}
        >
          {record.state.value !== 'notActive' ? <StopOutlined /> : <CheckCircleOutlined />}
        </Tooltip>
      </Popconfirm>{' '}
    </Button>,

    <Button
      type={'link'}
      style={{ padding: 0 }}
      disabled={getButtonPermission('device/Instance', ['delete'])}
    >
      <Popconfirm
        title={intl.formatMessage({
          id:
            record.state.value === 'notActive'
              ? 'pages.data.option.remove.tips'
              : 'pages.device.instance.deleteTip',
        })}
        key={'delete'}
        onConfirm={async () => {
          if (record.state.value === 'notActive') {
            await service.remove(record.id);
            message.success(
              intl.formatMessage({
                id: 'pages.data.option.success',
                defaultMessage: '操作成功!',
              }),
            );
            actionRef.current?.reload();
          } else {
            message.error(intl.formatMessage({ id: 'pages.device.instance.deleteTip' }));
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
    </Button>,
  ];

  const columns: ProColumns<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.deviceName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.productName',
        defaultMessage: '产品名称',
      }),
      dataIndex: 'productName',
      width: 200,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      width: '200px',
      valueType: 'dateTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      width: '90px',
      valueType: 'select',
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      valueEnum: {
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '未启用',
          }),
          status: 'notActive',
        },
        offline: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offline',
        },
        online: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'online',
        },
      },
      filterMultiple: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.description',
        defaultMessage: '说明',
      }),
      dataIndex: 'describe',
      width: '15%',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 200,
      render: (text, record) => tools(record),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          disabled={getButtonPermission('device/Instance', ['export'])}
          icon={<ExportOutlined />}
          type="default"
          onClick={() => {
            setExportVisible(true);
          }}
        >
          批量导出设备
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button
          disabled={getButtonPermission('device/Instance', ['import'])}
          icon={<ImportOutlined />}
          onClick={() => {
            setImportVisible(true);
          }}
        >
          批量导入设备
        </Button>
      </Menu.Item>
      <Menu.Item key="4">
        <Button
          disabled={getButtonPermission('device/Instance', ['active'])}
          icon={<CheckCircleOutlined />}
          type="primary"
          ghost
        >
          <Popconfirm
            title={'确认激活全部设备？'}
            onConfirm={() => {
              setType('active');
              const activeAPI = `/${
                SystemConst.API_BASE
              }/device-instance/deploy?:X_Access_Token=${Token.get()}`;
              setApi(activeAPI);
              setOperationVisible(true);
            }}
          >
            激活全部设备
          </Popconfirm>
        </Button>
      </Menu.Item>
      <Menu.Item key="5">
        <Button
          disabled={getButtonPermission('device/Instance', ['sync'])}
          icon={<SyncOutlined />}
          type="primary"
          onClick={() => {
            setType('sync');
            const syncAPI = `/${
              SystemConst.API_BASE
            }/device-instance/state/_sync?:X_Access_Token=${Token.get()}`;
            setApi(syncAPI);
            setOperationVisible(true);
          }}
        >
          同步设备状态
        </Button>
      </Menu.Item>
      {bindKeys.length > 0 && (
        <Menu.Item key="3">
          <Button
            disabled={getButtonPermission('device/Instance', ['delete'])}
            icon={<DeleteOutlined />}
            type="primary"
            danger
          >
            <Popconfirm
              title="确认删除选中设备?"
              onConfirm={() => {
                service.batchDeleteDevice(bindKeys).then((resp) => {
                  if (resp.status === 200) {
                    message.success('操作成功');
                    actionRef.current?.reset?.();
                  }
                });
              }}
              okText="确认"
              cancelText="取消"
            >
              删除选中设备
            </Popconfirm>
          </Button>
        </Menu.Item>
      )}
      {bindKeys.length > 0 && (
        <Menu.Item key="6">
          <Button
            disabled={getButtonPermission('device/Instance', ['action'])}
            icon={<StopOutlined />}
            type="primary"
            danger
          >
            <Popconfirm
              title="确认禁用选中设备?"
              onConfirm={() => {
                service.batchUndeployDevice(bindKeys).then((resp) => {
                  if (resp.status === 200) {
                    message.success('操作成功');
                    actionRef.current?.reset?.();
                  }
                });
              }}
              okText="确认"
              cancelText="取消"
            >
              禁用选中设备
            </Popconfirm>
          </Button>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <PageContainer>
      <SearchComponent<DeviceInstance>
        field={columns}
        target="device-instance"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setSearchParams({});
        // }}
      />
      <ProTableCard<DeviceInstance>
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
        request={(params) =>
          service.query({
            ...params,
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          })
        }
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          selectedRowKeys: bindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setBindKeys(selectedRows.map((item) => item.id));
          },
        }}
        headerTitle={[
          <Button
            onClick={() => {
              setVisible(true);
              setCurrent({});
            }}
            style={{ marginRight: 12 }}
            disabled={getButtonPermission('device/Instance', 'add')}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
          <Dropdown key={'more'} overlay={menu} placement="bottom">
            <Button>批量操作</Button>
          </Dropdown>,
        ]}
        cardRender={(record) => (
          <DeviceCard
            {...record}
            detail={
              <div
                style={{ padding: 8, fontSize: 24 }}
                onClick={() => {
                  InstanceModel.current = record;
                  const url = getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], record.id);
                  history.push(url);
                }}
              >
                <EyeOutlined />
              </div>
            }
            actions={[
              <Button
                type={'link'}
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
                }}
                key={'edit'}
                disabled={getButtonPermission('device/Instance', ['update', 'add'])}
              >
                <EditOutlined />
                {intl.formatMessage({
                  id: 'pages.data.option.edit',
                  defaultMessage: '编辑',
                })}
              </Button>,
              <Button
                disabled={getButtonPermission('device/Instance', ['action'])}
                type={'link'}
                style={{ padding: 0 }}
              >
                <Popconfirm
                  key={'state'}
                  title={intl.formatMessage({
                    id: `pages.data.option.${
                      record.state.value !== 'notActive' ? 'disabled' : 'enabled'
                    }.tips`,
                    defaultMessage: '确认禁用？',
                  })}
                  onConfirm={async () => {
                    if (record.state.value !== 'notActive') {
                      await service.undeployDevice(record.id);
                    } else {
                      await service.deployDevice(record.id);
                    }
                    message.success(
                      intl.formatMessage({
                        id: 'pages.data.option.success',
                        defaultMessage: '操作成功!',
                      }),
                    );
                    actionRef.current?.reload();
                  }}
                >
                  {record.state.value !== 'notActive' ? <StopOutlined /> : <CheckCircleOutlined />}
                  {intl.formatMessage({
                    id: `pages.data.option.${
                      record.state.value !== 'notActive' ? 'disabled' : 'enabled'
                    }`,
                    defaultMessage: record.state.value !== 'notActive' ? '禁用' : '启用',
                  })}
                </Popconfirm>
              </Button>,

              <Button
                key="delete"
                disabled={getButtonPermission('device/Instance', ['delete'])}
                type={'link'}
                style={{ padding: 0 }}
              >
                <Popconfirm
                  title={intl.formatMessage({
                    id:
                      record.state.value === 'notActive'
                        ? 'pages.data.option.remove.tips'
                        : 'pages.device.instance.deleteTip',
                  })}
                  key={'delete'}
                  onConfirm={async () => {
                    if (record.state.value === 'notActive') {
                      await service.remove(record.id);
                      message.success(
                        intl.formatMessage({
                          id: 'pages.data.option.success',
                          defaultMessage: '操作成功!',
                        }),
                      );
                      actionRef.current?.reload();
                    } else {
                      message.error(intl.formatMessage({ id: 'pages.device.instance.deleteTip' }));
                    }
                  }}
                >
                  <DeleteOutlined />
                </Popconfirm>
              </Button>,
            ]}
          />
        )}
      />
      <Save
        data={current}
        model={!Object.keys(current).length ? 'add' : 'edit'}
        close={() => {
          setVisible(false);
        }}
        reload={() => {
          actionRef.current?.reload();
        }}
        visible={visible}
      />
      <Export
        data={searchParams}
        close={() => {
          setExportVisible(false);
          actionRef.current?.reload();
        }}
        visible={exportVisible}
      />
      <Import
        data={current}
        close={() => {
          setImportVisible(false);
          actionRef.current?.reload();
        }}
        visible={importVisible}
      />
      {operationVisible && (
        <Process
          api={api}
          action={type}
          closeVisible={() => {
            setOperationVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default Instance;
