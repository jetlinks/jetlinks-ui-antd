// 视频设备通道列表
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import './index.less';
import { useEffect, useRef, useState } from 'react';
import { ChannelItem } from '@/pages/media/Device/Channel/typings';
import { useHistory, useIntl, useLocation } from 'umi';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import Save from './Save';
import Service from './service';
import { ProviderValue } from '../index';
import Live from './Live';
import { getButtonPermission, getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import Tree from './Tree';
import { useDomFullHeight } from '@/hooks';

export const service = new Service('media');

export default () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [queryParam, setQueryParam] = useState({});
  const [visible, setVisible] = useState<boolean>(false);
  const [liveVisible, setLiveVisible] = useState(false);
  const [current, setCurrent] = useState<ChannelItem>();
  const [deviceId, setDeviceId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [type, setType] = useState('');
  const { minHeight } = useDomFullHeight(`.channelDevice`, 24);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const param = new URLSearchParams(location.search);
    const _deviceId = param.get('id');
    const _type = param.get('type');
    if (_deviceId) {
      setDeviceId(_deviceId);
    }
    if (_type) {
      setType(_type);
    }
  }, [location]);

  /**
   * table 查询参数
   * @param data
   */
  const searchFn = (data: any) => {
    setQueryParam(data);
  };

  const deleteItem = async (id: string) => {
    const resp: any = await service.removeChannel(id);
    if (resp.status === 200) {
      actionRef.current?.reload();
    } else {
      message.error('删除失败');
    }
  };

  const columns: ProColumns<ChannelItem>[] = [
    {
      dataIndex: 'channelId',
      title: '通道ID',
      width: 200,
      ellipsis: true,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      width: 200,
      ellipsis: true,
    },
    {
      dataIndex: 'manufacturer',
      title: intl.formatMessage({
        id: 'pages.media.device.manufacturer',
        defaultMessage: '设备厂家',
      }),
      hideInTable: type !== ProviderValue.GB281,
    },
    {
      dataIndex: 'address',
      title: '安装地址',
      ellipsis: true,
    },
    {
      dataIndex: 'state',
      width: 90,
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      valueType: 'select',
      valueEnum: {
        online: {
          text: '已连接',
          status: 'online',
        },
        offline: {
          text: '离线',
          status: 'offline',
        },
      },
      render: (_, record) => (
        <BadgeStatus
          status={record.status.value}
          statusNames={{
            online: StatusColorEnum.success,
            offline: StatusColorEnum.error,
            notActive: StatusColorEnum.processing,
          }}
          text={record.status.text}
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 120,
      render: (_, record) => [
        <Tooltip
          key="edit"
          title={intl.formatMessage({
            id: 'pages.data.option.edit',
            defaultMessage: '编辑',
          })}
        >
          <Button
            style={{ padding: 0 }}
            type="link"
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
            disabled={getButtonPermission('media/Device', 'update')}
          >
            <EditOutlined />
          </Button>
        </Tooltip>,
        <Tooltip key={'live'} title={'播放'}>
          <a
            onClick={() => {
              setChannelId(record.channelId);
              setLiveVisible(true);
            }}
          >
            <VideoCameraOutlined />
          </a>
        </Tooltip>,
        <Tooltip key={'playback'} title={'回放'}>
          <a
            onClick={() => {
              history.push(
                `${getMenuPathByCode(MENUS_CODE['media/Device/Playback'])}?id=${
                  record.deviceId
                }&channelId=${record.channelId}`,
              );
            }}
          >
            <VideoCameraAddOutlined />
          </a>
        </Tooltip>,
        type === ProviderValue.FIXED ? (
          <Popconfirm
            key="delete"
            title={intl.formatMessage({
              id: 'page.table.isDelete',
              defaultMessage: '是否删除?',
            })}
            onConfirm={async () => {
              deleteItem(record.id);
            }}
            disabled={getButtonPermission('media/Device', 'delete')}
          >
            <Tooltip title="删除">
              <Button
                type={'link'}
                style={{ padding: 0 }}
                disabled={getButtonPermission('media/Device', 'delete')}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
        ) : null,
      ],
    },
  ];

  return (
    <PageContainer>
      <div className={'device-channel-warp'}>
        {type === ProviderValue.GB281 && (
          <div className={'left'}>
            <Tree
              deviceId={deviceId}
              onSelect={(key) => {
                if (key === deviceId && actionRef.current?.reset) {
                  actionRef.current?.reset();
                } else {
                  setQueryParam({
                    terms: [
                      {
                        column: 'parentId',
                        value: key,
                      },
                    ],
                  });
                }
              }}
            />
          </div>
        )}
        <div className={'right'}>
          <SearchComponent field={columns} onSearch={searchFn} target={'media-channel'} />
          <ProTable<ChannelItem>
            columns={columns}
            actionRef={actionRef}
            // scroll={{x:1366}}
            tableClassName={'channelDevice'}
            tableStyle={{ minHeight }}
            options={{ fullScreen: true }}
            params={queryParam}
            defaultParams={[
              {
                column: 'id',
              },
            ]}
            request={(params = {}) =>
              service.queryChannel(deviceId, {
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
              type === ProviderValue.GB281 ? (
                <Tooltip
                  key="button"
                  title={<div style={{ width: 265 }}>接入方式为GB/T28281时，不支持新增</div>}
                >
                  <Button disabled>
                    {intl.formatMessage({
                      id: 'pages.data.option.add',
                      defaultMessage: '新增',
                    })}
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  onClick={() => {
                    setCurrent(undefined);
                    setVisible(true);
                  }}
                  key="button"
                  disabled={getButtonPermission('media/Device', 'add')}
                  icon={<PlusOutlined />}
                  type="primary"
                >
                  {intl.formatMessage({
                    id: 'pages.data.option.add',
                    defaultMessage: '新增',
                  })}
                </Button>
              ),
            ]}
          />
        </div>
      </div>
      <Save
        visible={visible}
        service={service}
        model={current ? 'edit' : 'add'}
        type={type}
        data={current}
        deviceId={deviceId}
        onCancel={() => {
          setVisible(false);
        }}
        onReload={() => {
          actionRef.current?.reload();
        }}
      />
      {liveVisible && (
        <Live
          visible={liveVisible}
          deviceId={deviceId}
          channelId={channelId}
          onCancel={() => {
            setLiveVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};
