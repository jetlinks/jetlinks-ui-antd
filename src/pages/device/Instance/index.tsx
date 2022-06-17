import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import moment from 'moment';
import { Badge, Button, Dropdown, Menu, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useIntl } from 'umi';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  ImportOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { model } from '@formily/reactive';
import Service from '@/pages/device/Instance/service';
import type { MetadataItem } from '@/pages/device/Product/typings';
import Save from './Save';
import Export from './Export';
import Import from './Import';
import Process from './Process';
import SearchComponent from '@/components/SearchComponent';
import { PermissionButton, ProTableCard } from '@/components';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import DeviceCard from '@/components/ProTableCard/CardItems/device';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { useLocation } from '@/hooks';
import { service as deptService } from '@/pages/system/Department';
import { service as categoryService } from '@/pages/device/Category';
import { onlyMessage } from '@/utils/util';

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
export const service = new Service('device-instance');
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
  const { permission } = PermissionButton.usePermission('device/Instance');
  const [jumpParams, setJumpParams] = useState<SearchTermsServer | undefined>(undefined);

  const intl = useIntl();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const _terms: any[] = [];
      Object.keys(location.state).forEach((key) => {
        _terms.push({
          column: key,
          value: location.state[key],
        });
      });
      setJumpParams([
        {
          terms: _terms,
          type: 'or',
        },
      ]);
      if (location.state && location.state?.save) {
        setVisible(true);
        setCurrent({});
      } else if (location.state && location.state?.import) {
        setImportVisible(true);
      }
    }
  }, [location]);

  const tools = (record: DeviceInstance) => [
    <Button
      type={'link'}
      style={{ padding: 0 }}
      key={'detail'}
      onClick={() => {
        InstanceModel.current = record;
        const url = getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], record.id);
        history.push(url);
      }}
    >
      <Tooltip
        title={intl.formatMessage({
          id: 'pages.data.option.detail',
          defaultMessage: '查看',
        })}
      >
        <EyeOutlined />
      </Tooltip>
    </Button>,
    <PermissionButton
      type={'link'}
      key={'state'}
      style={{ padding: 0 }}
      popConfirm={{
        title: intl.formatMessage({
          id: `pages.data.option.${
            record.state.value !== 'notActive' ? 'disabled' : 'enabled'
          }.tips`,
          defaultMessage: '确认禁用？',
        }),
        onConfirm: () => {
          if (record.state.value !== 'notActive') {
            service.undeployDevice(record.id).then((resp: any) => {
              if (resp.status === 200) {
                onlyMessage(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            });
          } else {
            service.deployDevice(record.id).then((resp: any) => {
              if (resp.status === 200) {
                onlyMessage(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            });
          }
        },
      }}
      isPermission={permission.action}
      tooltip={{
        title: intl.formatMessage({
          id: `pages.data.option.${record.state.value !== 'notActive' ? 'disabled' : 'enabled'}`,
          defaultMessage: record.state.value !== 'notActive' ? '禁用' : '启用',
        }),
      }}
    >
      {record.state.value !== 'notActive' ? <StopOutlined /> : <PlayCircleOutlined />}
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      key={'delete'}
      style={{ padding: 0 }}
      isPermission={permission.delete}
      tooltip={
        record.state.value !== 'notActive'
          ? { title: intl.formatMessage({ id: 'pages.device.instance.deleteTip' }) }
          : undefined
      }
      disabled={record.state.value !== 'notActive'}
      popConfirm={{
        title: intl.formatMessage({
          id: 'pages.data.option.remove.tips',
        }),
        disabled: record.state.value !== 'notActive',
        onConfirm: async () => {
          if (record.state.value === 'notActive') {
            await service.remove(record.id);
            onlyMessage(
              intl.formatMessage({
                id: 'pages.data.option.success',
                defaultMessage: '操作成功!',
              }),
            );
            actionRef.current?.reload();
          } else {
            onlyMessage(intl.formatMessage({ id: 'pages.device.instance.deleteTip' }), 'error');
          }
        },
      }}
    >
      <DeleteOutlined />
    </PermissionButton>,
  ];

  const columns: ProColumns<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      ellipsis: true,
      fixed: 'left',
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
      dataIndex: 'productId',
      width: 200,
      ellipsis: true,
      valueType: 'select',
      request: async () => {
        const res = await service.getProductList();
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        }
        return [];
      },
      render: (_, row) => row.productName,
      filterMultiple: true,
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
            defaultMessage: '禁用',
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
      dataIndex: 'categoryId',
      title: '产品分类',
      valueType: 'treeSelect',
      hideInTable: true,
      fieldProps: {
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
      request: () =>
        categoryService
          .queryTree({
            paging: false,
          })
          .then((resp: any) => resp.result),
    },
    {
      dataIndex: 'productId$product-info',
      title: '接入方式',
      valueType: 'select',
      hideInTable: true,
      request: () =>
        service.queryGatewayList().then((resp: any) =>
          resp.result.map((item: any) => ({
            label: item.name,
            value: `accessId is ${item.id}`,
          })),
        ),
    },
    {
      dataIndex: 'deviceType',
      title: '设备类型',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        device: {
          text: '直连设备',
          status: 'device',
        },
        childrenDevice: {
          text: '网关子设备',
          status: 'childrenDevice',
        },
        gateway: {
          text: '网关设备',
          status: 'gateway',
        },
      },
    },
    {
      dataIndex: 'id$dim-assets',
      title: '所属部门',
      valueType: 'treeSelect',
      hideInTable: true,
      fieldProps: {
        fieldNames: {
          label: 'name',
          value: 'value',
        },
      },
      request: () =>
        deptService
          .queryOrgThree({
            paging: false,
          })
          .then((resp) => {
            const formatValue = (list: any[]) => {
              const _list: any[] = [];
              list.forEach((item) => {
                if (item.children) {
                  item.children = formatValue(item.children);
                }
                _list.push({
                  ...item,
                  value: JSON.stringify({
                    assetType: 'device',
                    targets: [
                      {
                        type: 'org',
                        id: item.id,
                      },
                    ],
                  }),
                });
              });
              return _list;
            };
            return formatValue(resp.result);
          }),
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
      width: 120,
      fixed: 'right',
      render: (text, record) => tools(record),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <PermissionButton
          isPermission={permission.export}
          icon={<ExportOutlined />}
          type="default"
          onClick={() => {
            setExportVisible(true);
          }}
        >
          批量导出设备
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="2">
        <PermissionButton
          isPermission={permission.import}
          icon={<ImportOutlined />}
          onClick={() => {
            setImportVisible(true);
          }}
        >
          批量导入设备
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="4">
        <PermissionButton
          isPermission={permission.action}
          icon={<CheckCircleOutlined />}
          type="primary"
          ghost
          popConfirm={{
            title: '确认激活全部设备？',
            onConfirm: async () => {
              setType('active');
              const activeAPI = `/${
                SystemConst.API_BASE
              }/device-instance/deploy?:X_Access_Token=${Token.get()}`;
              setApi(activeAPI);
              setOperationVisible(true);
            },
          }}
        >
          激活全部设备
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="5">
        <PermissionButton
          isPermission={true}
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
        </PermissionButton>
      </Menu.Item>
      {bindKeys.length > 0 && (
        <Menu.Item key="3">
          <PermissionButton
            isPermission={permission.delete}
            icon={<DeleteOutlined />}
            type="primary"
            danger
            popConfirm={{
              title: '确认删除选中设备?',
              onConfirm: () => {
                service.batchDeleteDevice(bindKeys).then((resp) => {
                  if (resp.status === 200) {
                    onlyMessage('操作成功');
                    actionRef.current?.reset?.();
                  }
                });
              },
            }}
          >
            删除选中设备
          </PermissionButton>
        </Menu.Item>
      )}
      {bindKeys.length > 0 && (
        <Menu.Item key="6">
          <PermissionButton
            isPermission={permission.action}
            icon={<StopOutlined />}
            type="primary"
            danger
            popConfirm={{
              title: '确认禁用选中设备?',
              onConfirm() {
                service.batchUndeployDevice(bindKeys).then((resp) => {
                  if (resp.status === 200) {
                    onlyMessage('操作成功');
                    actionRef.current?.reset?.();
                  }
                });
              },
            }}
          >
            禁用选中设备
          </PermissionButton>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <PageContainer>
      <SearchComponent<DeviceInstance>
        field={columns}
        target="device-instance"
        initParam={jumpParams}
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
        scroll={{ x: 1366 }}
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
          <PermissionButton
            onClick={() => {
              setVisible(true);
              setCurrent({});
            }}
            style={{ marginRight: 12 }}
            isPermission={permission.add}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
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
              <PermissionButton
                type={'link'}
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
                }}
                key={'edit'}
                isPermission={permission.update}
              >
                <EditOutlined />
                {intl.formatMessage({
                  id: 'pages.data.option.edit',
                  defaultMessage: '编辑',
                })}
              </PermissionButton>,
              <PermissionButton
                isPermission={permission.action}
                type={'link'}
                key={'state'}
                style={{ padding: 0 }}
                popConfirm={{
                  title: intl.formatMessage({
                    id: `pages.data.option.${
                      record.state.value !== 'notActive' ? 'disabled' : 'enabled'
                    }.tips`,
                    defaultMessage: '确认禁用？',
                  }),
                  onConfirm: async () => {
                    if (record.state.value !== 'notActive') {
                      await service.undeployDevice(record.id);
                    } else {
                      await service.deployDevice(record.id);
                    }
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
                {record.state.value !== 'notActive' ? <StopOutlined /> : <PlayCircleOutlined />}
                {intl.formatMessage({
                  id: `pages.data.option.${
                    record.state.value !== 'notActive' ? 'disabled' : 'enabled'
                  }`,
                  defaultMessage: record.state.value !== 'notActive' ? '禁用' : '启用',
                })}
              </PermissionButton>,
              <PermissionButton
                key="delete"
                isPermission={permission.delete}
                type={'link'}
                style={{ padding: 0 }}
                tooltip={
                  record.state.value !== 'notActive'
                    ? { title: intl.formatMessage({ id: 'pages.device.instance.deleteTip' }) }
                    : undefined
                }
                disabled={record.state.value !== 'notActive'}
                popConfirm={{
                  title: intl.formatMessage({
                    id: 'pages.data.option.remove.tips',
                  }),
                  disabled: record.state.value !== 'notActive',
                  onConfirm: async () => {
                    if (record.state.value === 'notActive') {
                      await service.remove(record.id);
                      onlyMessage(
                        intl.formatMessage({
                          id: 'pages.data.option.success',
                          defaultMessage: '操作成功!',
                        }),
                      );
                      actionRef.current?.reload();
                    } else {
                      onlyMessage(
                        intl.formatMessage({ id: 'pages.device.instance.deleteTip' }),
                        'error',
                      );
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
