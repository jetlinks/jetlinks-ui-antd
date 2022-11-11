// 视频设备列表
import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Button, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PartitionOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { DeviceItem } from '@/pages/media/Device/typings';
import { useHistory, useIntl } from 'umi';
import { BadgeStatus, PermissionButton, ProTableCard } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import SearchComponent from '@/components/SearchComponent';
import MediaDevice from '@/components/ProTableCard/CardItems/mediaDevice';
import { getMenuPathByCode, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import Service from './service';
import { onlyMessage } from '@/utils/util';
import encodeQuery from '@/utils/encodeQuery';

export const service = new Service('media/device');

export const providerType = {
  'gb28181-2016': 'GB/T28181',
  'fixed-media': '固定地址',
};

export const ProviderValue = {
  GB281: 'gb28181-2016',
  FIXED: 'fixed-media',
};

const Device = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [queryParam, setQueryParam] = useState({});
  const history = useHistory<Record<string, string>>();
  const { permission } = PermissionButton.usePermission('media/Device');

  /**
   * table 查询参数
   * @param data
   */
  const searchFn = (data: any) => {
    setQueryParam(data);
  };

  const deleteItem = async (id: string) => {
    const response: any = await service.remove(id);
    if (response.status === 200) {
      onlyMessage(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功!',
        }),
      );
      actionRef.current?.reload();
    }
  };

  /**
   * 更新通道
   * @param id 视频设备ID
   */
  const updateChannel = async (id: string) => {
    const resp = await service.updateChannels(id);
    if (resp.status === 200) {
      actionRef.current?.reload();
      onlyMessage('通道更新成功');
    } else {
      onlyMessage('通道更新失败', 'error');
    }
  };

  const columns: ProColumns<DeviceItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      ellipsis: true,
      fixed: 'left',
    },
    {
      dataIndex: 'name',
      ellipsis: true,
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'provider',
      title: '接入方式',
      render: (_, row) => {
        return providerType[row.provider];
      },
      valueType: 'select',
      valueEnum: {
        [ProviderValue.FIXED]: {
          text: '固定地址',
          status: ProviderValue.FIXED,
        },
        [ProviderValue.GB281]: {
          text: 'GB/T28181',
          status: ProviderValue.GB281,
        },
      },
      filterMultiple: false,
    },
    {
      dataIndex: 'channelNumber',
      title: intl.formatMessage({
        id: 'pages.media.device.channelNumber',
        defaultMessage: '通道数量',
      }),
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      dataIndex: 'manufacturer',
      ellipsis: true,
      title: intl.formatMessage({
        id: 'pages.media.device.manufacturer',
        defaultMessage: '设备厂家',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.productName',
        defaultMessage: '产品名称',
      }),
      dataIndex: 'productId',
      ellipsis: true,
      valueType: 'select',
      hideInTable: false,
      request: async () => {
        const res = await service.getProductList(
          encodeQuery({
            terms: {
              messageProtocol$in: ['gb28181-2016', 'fixed-media'],
            },
          }),
        );
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        }
        return [];
      },
      // render: (_, row) => row.productName,
      filterMultiple: true,
    },
    // {
    //   dataIndex: 'model',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.model',
    //     defaultMessage: '型号',
    //   }),
    // },
    // {
    //   dataIndex: 'firmware',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.firmware',
    //     defaultMessage: '固件版本',
    //   }),
    // },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (_, record) => (
        <BadgeStatus
          status={record.state.value}
          statusNames={{
            online: StatusColorEnum.success,
            offline: StatusColorEnum.error,
            notActive: StatusColorEnum.warning,
          }}
          text={record.state.text}
        />
      ),
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
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'left',
      width: 200,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          key="edit"
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
          isPermission={permission.update}
          style={{ padding: 0 }}
          type={'link'}
          onClick={() => {
            const url = getMenuPathByCode(MENUS_CODE[`media/Device/Save`]);
            history.push(url + `?id=${record.id}`);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          tooltip={{
            title: '查看通道',
          }}
          style={{ padding: 0 }}
          type={'link'}
          onClick={() => {
            history.push(
              `${getMenuPathByCode(MENUS_CODE['media/Device/Channel'])}?id=${record.id}&type=${
                record.provider
              }`,
            );
          }}
          isPermission={true}
          key={'view'}
        >
          <PartitionOutlined />
        </PermissionButton>,
        <Tooltip key={'deviceDetail'} title={'查看'}>
          <Button
            style={{ padding: 0 }}
            type={'link'}
            onClick={() => {
              history.push(
                `${getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], record.id)}`,
              );
            }}
          >
            <EyeOutlined />
          </Button>
        </Tooltip>,
        <PermissionButton
          tooltip={
            record.state.value === 'offline' ||
            record.state.value === 'notActive' ||
            record.provider === 'fixed-media'
              ? {
                  title:
                    record.provider === 'fixed-media'
                      ? '固定地址无法更新通道'
                      : record.state.value === 'offline'
                      ? '设备已离线'
                      : record.state.value === 'notActive'
                      ? '设备已禁用'
                      : '',
                }
              : undefined
          }
          key={'updateChannel'}
          isPermission={permission.update}
          disabled={
            record.state.value === 'offline' ||
            record.state.value === 'notActive' ||
            record.provider === 'fixed-media'
          }
          style={{ padding: 0 }}
          type={'link'}
          onClick={() => {
            updateChannel(record.id);
          }}
        >
          <SyncOutlined />
        </PermissionButton>,
        <PermissionButton
          key={'delete'}
          tooltip={{
            title: record.state.value === 'online' ? '在线设备无法删除' : '删除',
          }}
          popConfirm={{
            title: (
              <div style={{ width: 100 }}>
                {intl.formatMessage({
                  id:
                    record.state.value !== 'offline'
                      ? 'pages.device.instance.deleteTip'
                      : 'page.table.isDelete',
                  defaultMessage: '是否删除?',
                })}
              </div>
            ),
            onConfirm: async () => {
              if (record.state.value !== 'online') {
                await deleteItem(record.id);
              } else {
                onlyMessage('在线设备不能进行删除操作', 'error');
              }
            },
          }}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.delete}
          disabled={record.state.value === 'online'}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent field={columns} onSearch={searchFn} target="media-device" />
      <ProTableCard<DeviceItem>
        columns={columns}
        actionRef={actionRef}
        options={{ fullScreen: true }}
        params={queryParam}
        columnEmptyText={''}
        scroll={{ x: 1366 }}
        request={(params = {}) =>
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
        headerTitle={[
          <PermissionButton
            onClick={() => {
              const url = getMenuPathByCode(MENUS_CODE[`media/Device/Save`]);
              history.push(url);
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            isPermission={permission.add}
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
        cardRender={(record) => (
          <MediaDevice
            {...record}
            // detail={
            //   <div
            //     style={{ fontSize: 18, padding: 8 }}
            //     onClick={() => {
            //       history.push(
            //         `${getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], record.id)}`,
            //       );
            //     }}
            //   >
            //     <EyeOutlined />
            //   </div>
            // }
            showMask={false}
            actions={[
              <PermissionButton
                key="edit"
                isPermission={permission.update}
                onClick={() => {
                  const url = getMenuPathByCode(MENUS_CODE[`media/Device/Save`]);
                  history.push(url + `?id=${record.id}`);
                }}
                type={'link'}
                style={{ padding: 0 }}
              >
                <EditOutlined />
                {intl.formatMessage({
                  id: 'pages.data.option.edit',
                  defaultMessage: '编辑',
                })}
              </PermissionButton>,
              <Button
                key={'viewChannel'}
                onClick={() => {
                  history.push(
                    `${getMenuPathByCode(MENUS_CODE['media/Device/Channel'])}?id=${
                      record.id
                    }&type=${record.provider}`,
                  );
                }}
              >
                <PartitionOutlined />
                查看通道
              </Button>,
              <PermissionButton
                key={'updateChannel'}
                isPermission={permission.update}
                tooltip={
                  record.state.value !== 'online' || record.provider === 'fixed-media'
                    ? {
                        title:
                          record.provider === 'fixed-media'
                            ? '固定地址无法更新通道'
                            : record.state.value === 'offline'
                            ? '设备已离线'
                            : record.state.value === 'notActive'
                            ? '设备已禁用'
                            : '',
                      }
                    : undefined
                }
                disabled={record.state.value !== 'online' || record.provider === 'fixed-media'}
                onClick={() => {
                  updateChannel(record.id);
                }}
              >
                <SyncOutlined />
                更新通道
              </PermissionButton>,
              <PermissionButton
                key="delete"
                popConfirm={{
                  title: intl.formatMessage({
                    id:
                      record.state.value !== 'online'
                        ? 'page.table.isDelete'
                        : 'pages.device.instance.deleteTip',
                    defaultMessage: '是否删除?',
                  }),
                  onConfirm: async () => {
                    if (record.state.value !== 'online') {
                      await deleteItem(record.id);
                    } else {
                      onlyMessage('在线设备不能进行删除操作', 'error');
                    }
                  },
                }}
                tooltip={
                  record.state.value === 'online' ? { title: '在线设备无法删除' } : undefined
                }
                type={'link'}
                style={{ padding: 0 }}
                isPermission={permission.delete}
                disabled={record.state.value === 'online'}
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
      />
      {/* <Save
        model={!current ? 'add' : 'edit'}
        data={current}
        close={() => {
          setVisible(false);
        }}
        reload={() => {
          actionRef.current?.reload();
        }}
        visible={visible}
      /> */}
    </PageContainer>
  );
};
export default Device;
