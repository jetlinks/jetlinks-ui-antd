import { PageContainer } from '@ant-design/pro-layout';
import { DeviceInstance } from '@/pages/device/Instance/typings';
import SearchComponent from '@/components/SearchComponent';
import { ActionType, ProColumns } from '@jetlinks/pro-table';
import moment from 'moment';
import { Badge, Tooltip } from 'antd';
import { service as categoryService } from '@/pages/device/Category';
import { InstanceModel, service, statusMap } from '@/pages/device/Instance';
import { useIntl } from '@@/plugin-locale/localeExports';
import {
  ControlOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ImportOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RedoOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PermissionButton, ProTableCard } from '@/components';
import { useRef, useState } from 'react';
import DeviceCard from '@/components/ProTableCard/CardItems/device';
import { onlyMessage } from '@/utils/util';
import Save from './Save';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';
import Import from '@/pages/device/Instance/Import';

export default () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [current, setCurrent] = useState<Partial<DeviceInstance>>({});
  const [visible, setVisible] = useState<boolean>(false);
  const history = useHistory<Record<string, string>>();
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const { permission } = PermissionButton.usePermission('edge/Device');
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;

  const tools = (record: DeviceInstance, type: 'card' | 'list') => [
    type === 'list' && (
      <PermissionButton
        type={'link'}
        style={{ padding: 0 }}
        key={'detail'}
        isPermission={permission.view && devicePermission.view}
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
      </PermissionButton>
    ),
    <PermissionButton
      type={'link'}
      isPermission={permission.update}
      onClick={() => {
        setCurrent(record);
        setVisible(true);
      }}
      tooltip={{
        title: type === 'list' ? '编辑' : '',
      }}
      style={{ padding: 0 }}
      key={'edit'}
    >
      <EditOutlined />
      {type === 'list' ? '' : '编辑'}
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      onClick={() => {
        service._control(record.id).then((resp: any) => {
          if (resp.status === 200) {
            window.open(resp.result);
          }
        });
      }}
      tooltip={{
        title: type === 'list' ? '远程控制' : '',
      }}
      isPermission={permission.setting}
      style={{ padding: 0 }}
      key={'control'}
    >
      <ControlOutlined />
      {type === 'list' ? '' : '远程控制'}
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      tooltip={{
        title: type !== 'list' ? '' : '重置密码',
      }}
      style={{ padding: 0 }}
      isPermission={permission.password}
      key={'reset'}
      popConfirm={{
        title: '确认重置密码为P@ssw0rd？',
        onConfirm: () => {
          service.restPassword(record.id).then((resp: any) => {
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
        },
      }}
    >
      <RedoOutlined />
      {type === 'list' ? '' : '重置密码'}
    </PermissionButton>,
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
        title:
          type === 'list'
            ? intl.formatMessage({
                id: `pages.data.option.${
                  record.state.value !== 'notActive' ? 'disabled' : 'enabled'
                }`,
                defaultMessage: record.state.value !== 'notActive' ? '禁用' : '启用',
              })
            : '',
      }}
    >
      {record.state.value !== 'notActive' ? <StopOutlined /> : <PlayCircleOutlined />}
      {record.state.value !== 'notActive'
        ? type === 'list'
          ? ''
          : '禁用'
        : type === 'list'
        ? ''
        : '启用'}
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      key={'delete'}
      style={{ padding: 0 }}
      isPermission={permission.delete}
      tooltip={
        record.state.value !== 'notActive'
          ? { title: intl.formatMessage({ id: 'pages.device.instance.deleteTip' }) }
          : { title: type !== 'list' ? '' : '删除' }
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
      width: 200,
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
      render: (_: any, row) => {
        return row.registryTime ? moment(row.registryTime).format('YYYY-MM-DD HH:mm:ss') : '';
      },
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
      dataIndex: 'classifiedId',
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
      width: 250,
      fixed: 'right',
      render: (text, record) => tools(record, 'list'),
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<DeviceInstance>
        field={columns}
        target="edge-device"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTableCard<DeviceInstance>
        columns={columns}
        scroll={{ x: 1366 }}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
        columnEmptyText={''}
        request={(params) =>
          service.query({
            ...params,
            terms: [
              ...(params?.terms || []),
              {
                terms: [
                  {
                    column: 'productId$product-info',
                    value: 'accessProvider is official-edge-gateway',
                  },
                ],
                type: 'and',
              },
            ],
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
          <PermissionButton
            isPermission={permission.import}
            icon={<ImportOutlined />}
            onClick={() => {
              setImportVisible(true);
            }}
          >
            导入
          </PermissionButton>,
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
            actions={tools(record, 'card')}
          />
        )}
      />
      {visible && (
        <Save
          data={current}
          model={!Object.keys(current).length ? 'add' : 'edit'}
          close={() => {
            setVisible(false);
          }}
          reload={() => {
            actionRef.current?.reload();
          }}
        />
      )}
      <Import
        // data={current}
        type={'official-edge-gateway'}
        close={() => {
          setImportVisible(false);
          actionRef.current?.reload();
        }}
        visible={importVisible}
      />
    </PageContainer>
  );
};
