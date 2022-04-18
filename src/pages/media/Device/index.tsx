// 视频设备列表
import {PageContainer} from '@ant-design/pro-layout';
import {useRef, useState} from 'react';
import type {ActionType, ProColumns} from '@jetlinks/pro-table';
import {Button, message, Tooltip} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PartitionOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type {DeviceItem} from '@/pages/media/Device/typings';
import {useHistory, useIntl} from 'umi';
import {BadgeStatus, PermissionButton, ProTableCard} from '@/components';
import {StatusColorEnum} from '@/components/BadgeStatus';
import SearchComponent from '@/components/SearchComponent';
import MediaDevice from '@/components/ProTableCard/CardItems/mediaDevice';
import {getMenuPathByCode, getMenuPathByParams, MENUS_CODE} from '@/utils/menu';
import Service from './service';
import Save from './Save';

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
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<DeviceItem>();
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
      message.success(
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
      message.success('通道更新成功');
    } else {
      message.error('通道更新失败');
    }
  };

  const columns: ProColumns<DeviceItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'name',
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
    },
    {
      dataIndex: 'manufacturer',
      title: intl.formatMessage({
        id: 'pages.media.device.manufacturer',
        defaultMessage: '设备厂家',
      }),
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
            notActive: StatusColorEnum.processing,
          }}
          text={record.state.text}
        />
      ),
      valueType: 'select',
      valueEnum: {
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
      align: 'center',
      width: 200,
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
            setCurrent(record);
            setVisible(true);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          tooltip={{
            title: '查看设备',
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
          tooltip={{
            title:
              record.provider === ProviderValue.FIXED
                ? '接入方式为固定地址时不支持更新通道'
                : '更新通道',
          }}
          key={'updateChannel'}
          isPermission={permission.action}
          disabled={record.state.value === 'offline' || record.provider === ProviderValue.FIXED}
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
            title: '删除',
          }}
          popConfirm={{
            title: intl.formatMessage({
              id:
                record.state.value === 'offline'
                  ? 'pages.device.productDetail.deleteTip'
                  : 'page.table.isDelete',
              defaultMessage: '是否删除?',
            }),
            onConfirm: async () => {
              if (record.state.value !== 'offline') {
                await deleteItem(record.id);
              } else {
                message.error('在线设备不能进行删除操作');
              }
            },
          }}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.delete}
          disabled={record.state.value !== 'offline'}
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
              setCurrent(undefined);
              setVisible(true);
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
            detail={
              <div
                style={{ fontSize: 18, padding: 8 }}
                onClick={() => {
                  history.push(
                    `${getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], record.id)}`,
                  );
                }}
              >
                <EyeOutlined />
              </div>
            }
            actions={[
              <PermissionButton
                key="edit"
                isPermission={permission.update}
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
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
                  record.state.value === 'offline' ||
                  record.provider === providerType['fixed-media']
                    ? {
                        title:
                          record.provider === providerType['fixed-media']
                            ? '固定地址无法更新通道'
                            : record.state.value === 'offline'
                            ? '设备已离线'
                            : '',
                      }
                    : undefined
                }
                disabled={
                  record.state.value === 'offline' ||
                  record.provider === providerType['fixed-media']
                }
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
                      record.state.value !== 'offline'
                        ? 'pages.device.instance.deleteTip'
                        : 'page.table.isDelete',
                    defaultMessage: '是否删除?',
                  }),
                  onConfirm: async () => {
                    if (record.state.value === 'offline') {
                      await deleteItem(record.id);
                    } else {
                      message.error('在线设备不能进行删除操作');
                    }
                  },
                }}
                type={'link'}
                style={{ padding: 0 }}
                isPermission={permission.delete}
                disabled={record.state.value !== 'offline'}
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
      />
      <Save
        model={!current ? 'add' : 'edit'}
        data={current}
        close={() => {
          setVisible(false);
        }}
        reload={() => {
          actionRef.current?.reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
};
export default Device;
