// 资产分配-设备管理
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Badge, Button, message, Popconfirm, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import type { DeviceItem } from '@/pages/system/Department/typings';
import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import Models from './model';
import Service from '@/pages/system/Department/Assets/service';
import Bind from './bind';
import SearchComponent from '@/components/SearchComponent';
import { ExtraDeviceCard, handlePermissionsMap } from '@/components/ProTableCard/CardItems/device';
import { ProTableCard } from '@/components';

export const service = new Service<DeviceItem>('assets');

type DeviceBadgeProps = {
  type: string;
  text: string;
};
export const DeviceBadge = (props: DeviceBadgeProps) => {
  const STATUS = {
    notActive: 'processing',
    offline: 'error',
    online: 'success',
  };
  return <Badge status={STATUS[props.type]} text={props.text} />;
};

export default observer((props: { parentId: string }) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const [searchParam, setSearchParam] = useState({});
  /**
   * 解除资产绑定
   */
  const handleUnBind = () => {
    if (Models.unBindKeys.length) {
      service
        .unBind('device', [
          {
            targetType: 'org',
            targetId: props.parentId,
            assetType: 'device',
            assetIdList: Models.unBindKeys,
          },
        ])
        .subscribe({
          next: () => message.success('操作成功'),
          error: () => message.error('操作失败'),
          complete: () => {
            Models.unBindKeys = [];
            actionRef.current?.reload();
          },
        });
    } else {
      message.warning('请勾选需要解绑的数据');
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
      width: 220,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.productName',
        defaultMessage: '所属产品',
      }),
      dataIndex: 'configuration',
      render: (_, row) => {
        return row.productName;
      },
    },
    {
      title: '资产权限',
      dataIndex: 'grantedPermissions',
      hideInSearch: true,
      render: (_, row) => {
        return handlePermissionsMap(row.grantedPermissions);
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      valueType: 'dateTime',
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
        all: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.all',
            defaultMessage: '全部',
          }),
          status: 'Default',
        },
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
            defaultMessage: '未启用',
          }),
          status: 'notActive',
        },
      },
      render: (_, row) => <DeviceBadge type={row.state.value} text={row.state.text} />,
      search: false,
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
        <Popconfirm
          title={intl.formatMessage({
            id: 'pages.system.role.option.unBindUser',
            defaultMessage: '是否解除绑定',
          })}
          key="unBind"
          onConfirm={() => {
            singleUnBind(record.id);
          }}
        >
          <Button type={'link'} style={{ padding: 0 }}>
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '解除绑定',
              })}
            >
              <DisconnectOutlined />
            </Tooltip>
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const closeModal = () => {
    Models.bind = false;
    Models.bindKeys = [];
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
        gridColumn={2}
        request={async (params) => {
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
            onUnBind={(e) => {
              e.stopPropagation();
              singleUnBind(record.id);
            }}
          />
        )}
        toolBarRender={() => [
          <Button
            onClick={() => {
              Models.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
            key="bind"
            disabled={!props.parentId}
          >
            {intl.formatMessage({
              id: 'pages.data.option.assets',
              defaultMessage: '资产分配',
            })}
          </Button>,
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '是否批量解除绑定',
            })}
            key="unBind"
            onConfirm={handleUnBind}
          >
            <Button icon={<DisconnectOutlined />}>
              {intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '批量解绑',
              })}
            </Button>
          </Popconfirm>,
        ]}
      />
    </>
  );
});
