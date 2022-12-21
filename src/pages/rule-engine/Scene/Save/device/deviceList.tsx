import { ProTableCard } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { service } from '@/pages/device/Instance/index';
import { isNoCommunity } from '@/utils/util';
import { service as categoryService } from '@/pages/device/Category';
import { useIntl } from 'umi';
import { SceneDeviceCard } from '@/components/ProTableCard/CardItems/device';
import { TriggerDeviceModel } from './addModel';
import { observer, Observer } from '@formily/reactive-react';
import { isArray } from 'lodash';

export default observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [searchParam, setSearchParam] = useState<any>({});

  const [oldRowKey] = useState(TriggerDeviceModel.deviceKeys);

  // const [loading, setLoading] = useState(true);

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
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      width: '90px',
      valueType: 'select',
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
      title: '网关类型',
      dataIndex: 'accessProvider',
      width: 150,
      ellipsis: true,
      valueType: 'select',
      hideInTable: true,
      request: () =>
        service.getProviders().then((resp: any) => {
          return (resp?.result || [])
            .filter((i: any) =>
              !isNoCommunity
                ? [
                    'mqtt-server-gateway',
                    'http-server-gateway',
                    'mqtt-client-gateway',
                    'tcp-server-gateway',
                  ].includes(i.id)
                : i,
            )
            .map((item: any) => ({
              label: item.name,
              value: `accessProvider is ${item.id}`,
            }));
        }),
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
  ];

  return (
    <>
      <SearchComponent
        field={columns}
        model={'simple'}
        enableSave={false}
        bodyStyle={{ padding: 0, paddingBottom: 16 }}
        onSearch={async (data) => {
          // if (loading) {
          //   setSearchParam(data);
          //   setLoading(true);
          // } else {
          //
          // }
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        target="scene-trugger-device"
        defaultParam={[
          {
            terms: [
              {
                column: 'productId',
                value: TriggerDeviceModel.productId,
              },
            ],
          },
        ]}
      />
      <Observer>
        {() => (
          <ProTableCard<DeviceInstance>
            noPadding
            cardScrollY={400}
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            search={false}
            gridColumn={2}
            columnEmptyText={''}
            onlyCard={true}
            tableAlertRender={false}
            rowSelection={{
              selectedRowKeys: [...TriggerDeviceModel.deviceKeys],
              onSelect: (record, selected) => {
                if (selected) {
                  TriggerDeviceModel.deviceKeys.push(record.id);
                  if (TriggerDeviceModel.selectorValues) {
                    TriggerDeviceModel.selectorValues?.push({
                      name: record.name,
                      value: record.id,
                    });
                  } else {
                    TriggerDeviceModel.selectorValues = [
                      {
                        name: record.name,
                        value: record.id,
                      },
                    ];
                  }
                } else {
                  const newArray = TriggerDeviceModel.selectorValues?.filter(
                    (item) => item.value !== record.id,
                  );
                  TriggerDeviceModel.deviceKeys = newArray?.map((item) => item.value) || [];
                  TriggerDeviceModel.selectorValues = newArray || [];
                }
              },
            }}
            onPageChange={(page, size) => {
              TriggerDeviceModel.devicePage = page;
              TriggerDeviceModel.devicePageSize = size;
            }}
            request={(params) => {
              const sorts: any[] = [{ name: 'createTime', order: 'desc' }];
              if (oldRowKey && isArray(oldRowKey)) {
                oldRowKey.forEach((v) => {
                  sorts.push({
                    name: 'id',
                    value: v,
                  });
                });
              }
              return service.query({
                ...params,
                sorts: sorts,
              });
            }}
            params={searchParam}
            cardRender={(record) => (
              <SceneDeviceCard showBindBtn={false} showTool={false} {...record} />
            )}
            height={'none'}
          />
        )}
      </Observer>
    </>
  );
});
