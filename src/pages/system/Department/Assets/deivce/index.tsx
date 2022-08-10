// 资产分配-设备管理
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Badge } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import type { DeviceItem } from '@/pages/system/Department/typings';
import { DisconnectOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Models from './model';
import Service from '@/pages/system/Department/Assets/service';
import Bind from './bind';
import SearchComponent from '@/components/SearchComponent';
import { ExtraDeviceCard, handlePermissionsMap } from '@/components/ProTableCard/CardItems/device';
import { PermissionButton, ProTableCard } from '@/components';
import { onlyMessage } from '@/utils/util';
import { ASSETS_TABS_ENUM, AssetsModel } from '@/pages/system/Department/Assets';
import UpdateModal from '@/pages/system/Department/Assets/updateModal';
import encodeQuery from '@/utils/encodeQuery';

export const service = new Service<DeviceItem>('assets');

type DeviceBadgeProps = {
  type: string;
  text: string;
};
export const DeviceBadge = (props: DeviceBadgeProps) => {
  const STATUS = {
    notActive: 'warning',
    offline: 'error',
    online: 'processing',
  };
  console.log(STATUS[props.type], props);
  return <Badge status={STATUS[props.type]} text={props.text} />;
};

export default observer((props: { parentId: string }) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('system/Department');
  const [searchParam, setSearchParam] = useState({});

  const [updateVisible, setUpdateVisible] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (AssetsModel.tabsIndex === ASSETS_TABS_ENUM.Device && actionRef.current) {
      actionRef.current.reload();
    }

    if (AssetsModel.tabsIndex === ASSETS_TABS_ENUM.Device && AssetsModel.bindModal) {
      Models.bind = true;
    }
  }, [AssetsModel.tabsIndex]);
  /**
   * 解除资产绑定
   */
  const handleUnBind = () => {
    if (Models.unBindKeys.length) {
      service
        .unBind('device', [
          {
            targetType: 'org',
            targetId: AssetsModel.parentId,
            assetType: 'device',
            assetIdList: Models.unBindKeys,
          },
        ])
        .subscribe({
          next: () => onlyMessage('操作成功'),
          error: () => onlyMessage('操作失败', 'error'),
          complete: () => {
            Models.unBindKeys = [];
            actionRef.current?.reload();
          },
        });
    } else {
      onlyMessage('请勾选需要解绑的数据', 'warning');
    }
  };

  const singleUnBind = (key: string) => {
    Models.unBindKeys = [key];
    handleUnBind();
  };

  const columns: ProColumns<DeviceItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 180,
      fixed: 'left',
      ellipsis: true,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      width: 180,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.productName',
        defaultMessage: '所属产品',
      }),
      valueType: 'select',
      dataIndex: 'productId$product-info',
      request: async () => {
        const res = await service.getProductList(encodeQuery({ sorts: { createTime: 'desc' } }));
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        }
        return [];
      },
      search: {
        transform: (value) => `id is ${value}`,
      },
      render: (_, row) => {
        return row.productName;
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: '资产权限',
      dataIndex: 'grantedPermissions',
      hideInSearch: true,
      render: (_, row) => {
        return handlePermissionsMap(row.grantedPermissions);
      },
      width: 80,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      // filters: true,
      // onFilter: true,
      valueType: 'select',
      valueEnum: {
        onLine: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'onLine',
        },
        offLine: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offLine',
        },
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '禁用',
          }),
          status: 'notActive',
        },
      },
      render: (_, row) => <DeviceBadge type={row.state.value} text={row.state.text} />,
      search: false,
      width: 80,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          key="update"
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: '编辑',
          }}
          onClick={(e) => {
            e?.stopPropagation();
            setUpdateId(record.id);
            setPermissions(record.grantedPermissions!);
            setUpdateVisible(true);
          }}
          isPermission={permission.edit}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          key="unbind"
          type={'link'}
          popConfirm={{
            title: intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '是否解除绑定',
            }),
            onConfirm: () => {
              singleUnBind(record.id);
            },
          }}
          isPermission={permission.bind}
        >
          <DisconnectOutlined />
        </PermissionButton>,
      ],
    },
  ];

  const closeModal = () => {
    Models.bind = false;
    Models.bindKeys = [];
    if (AssetsModel.bindModal) {
      AssetsModel.params = {};
      AssetsModel.bindModal = false;
    }
  };

  const getData = (params: any, parentId: string) => {
    return new Promise((resolve) => {
      service.queryDeviceList2(params, parentId).subscribe((data) => {
        resolve(data);
      });
    });
  };

  useEffect(() => {
    setSearchParam({
      terms: [
        {
          column: 'id',
          termType: 'dim-assets',
          value: {
            assetType: 'device',
            targets: [
              {
                type: 'org',
                id: props.parentId,
              },
            ],
          },
        },
      ],
    });
    actionRef.current?.reset?.();
    //  初始化所有状态
    Models.bindKeys = [];
    Models.unBindKeys = [];
  }, [props.parentId]);

  return (
    <>
      {Models.bind && (
        <Bind
          visible={Models.bind}
          onCancel={closeModal}
          reload={() => actionRef.current?.reload()}
          parentId={props.parentId}
        />
      )}
      {updateVisible && (
        <UpdateModal
          permissions={permissions}
          visible={updateVisible}
          id={updateId}
          type="device"
          targetId={props.parentId}
          onCancel={() => {
            setUpdateVisible(false);
          }}
          onReload={() => {
            actionRef.current?.reload();
          }}
        />
      )}
      <SearchComponent<DeviceItem>
        field={columns}
        defaultParam={[
          {
            column: 'id',
            termType: 'dim-assets',
            value: {
              assetType: 'device',
              targets: [
                {
                  type: 'org',
                  id: props.parentId,
                },
              ],
            },
          },
        ]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setSearchParam({});
        // }}
        target="department-assets-device"
      />
      <ProTableCard<DeviceItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        search={false}
        params={searchParam}
        columnEmptyText={''}
        gridColumn={2}
        height={'none'}
        scroll={{ x: 1366 }}
        request={async (params) => {
          params.sorts = [{ name: 'createTime', order: 'desc' }];
          if (!props.parentId) {
            return {
              code: 200,
              result: {
                data: [],
                pageIndex: 0,
                pageSize: 0,
                total: 0,
              },
              status: 200,
            };
          }
          const resp: any = await getData(params, props.parentId);
          return {
            code: resp.status,
            result: resp.result,
            status: resp.status,
          };
        }}
        rowSelection={{
          selectedRowKeys: Models.unBindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            Models.unBindKeys = selectedRows.map((item) => item.id);
          },
        }}
        cardRender={(record) => (
          <ExtraDeviceCard
            {...record}
            actions={[
              <PermissionButton
                key="update"
                onClick={(e) => {
                  e?.stopPropagation();
                  setUpdateId(record.id);
                  setPermissions(record.grantedPermissions!);
                  setUpdateVisible(true);
                }}
                isPermission={permission.edit}
              >
                <EditOutlined />
              </PermissionButton>,
              <PermissionButton
                key="unbind"
                popConfirm={{
                  title: intl.formatMessage({
                    id: 'pages.system.role.option.unBindUser',
                    defaultMessage: '是否解除绑定',
                  }),
                  onConfirm: (e) => {
                    e?.stopPropagation();
                    singleUnBind(record.id);
                  },
                  onCancel: (e) => {
                    e?.stopPropagation();
                  },
                }}
                onClick={(e) => {
                  e?.stopPropagation();
                }}
                isPermission={permission.bind}
              >
                <DisconnectOutlined />
              </PermissionButton>,
            ]}
          />
        )}
        toolBarRender={() => [
          <PermissionButton
            onClick={() => {
              Models.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
            key="bind"
            disabled={!props.parentId}
            isPermission={permission.assert}
          >
            {intl.formatMessage({
              id: 'pages.data.option.assets',
              defaultMessage: '资产分配',
            })}
          </PermissionButton>,
          <PermissionButton
            icon={<DisconnectOutlined />}
            key="unBind"
            popConfirm={{
              title: intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '是否批量解除绑定',
              }),
              onConfirm: handleUnBind,
            }}
            tooltip={{
              title: intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '批量解绑',
              }),
            }}
            isPermission={permission.bind}
          >
            {intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '批量解绑',
            })}
          </PermissionButton>,
        ]}
      />
    </>
  );
});
