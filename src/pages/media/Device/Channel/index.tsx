// 视频设备通道列表
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import './index.less';
import { useEffect, useRef, useState } from 'react';
import { ChannelItem } from '@/pages/media/Device/Channel/typings';
import { useIntl, useLocation, useHistory } from 'umi';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import Save from './Save';
import Service from './service';
import { ProviderValue } from '../index';
import Live from './Live';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import Tree from './Tree';

export const service = new Service('media');

export default () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [queryParam, setQueryParam] = useState({});
  const [visible, setVisible] = useState<boolean>(false);
  const [liveVisible, setLiveVisible] = useState(false);
  const [current, setCurrent] = useState<ChannelItem>();
  const [deviceId, setDeviceId] = useState('');
  const [type, setType] = useState('');

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
      width: 220,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      width: 220,
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
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
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
      width: 200,
      render: (_, record) => [
        <Tooltip
          key="edit"
          title={intl.formatMessage({
            id: 'pages.data.option.edit',
            defaultMessage: '编辑',
          })}
        >
          <a
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
          >
            <EditOutlined />
          </a>
        </Tooltip>,
        <Tooltip key={'live'} title={'播发'}>
          <a
            onClick={() => {
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
                `${getMenuPathByCode(MENUS_CODE['media/Device/Playback'])}?id=${record.channelId}`,
              );
            }}
          >
            <VideoCameraAddOutlined />
          </a>
        </Tooltip>,
        type === ProviderValue.FIXED ? (
          <Tooltip key={'updateChannel'} title="删除">
            <Popconfirm
              key="delete"
              title={intl.formatMessage({
                id: 'page.table.isDelete',
                defaultMessage: '是否删除?',
              })}
              onConfirm={async () => {
                deleteItem(record.id);
              }}
            >
              <Button type={'link'} style={{ padding: '4px' }}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        ) : null,
      ],
    },
  ];

  return (
    <PageContainer>
      <div className={'device-channel-warp'}>
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
        <div className={'right'}>
          <SearchComponent field={columns} onSearch={searchFn} />
          <ProTable<ChannelItem>
            columns={columns}
            actionRef={actionRef}
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
            headerTitle={
              type === ProviderValue.FIXED
                ? [
                    <Button
                      onClick={() => {
                        setCurrent(undefined);
                        setVisible(true);
                      }}
                      key="button"
                      icon={<PlusOutlined />}
                      type="primary"
                    >
                      {intl.formatMessage({
                        id: 'pages.data.option.add',
                        defaultMessage: '新增',
                      })}
                    </Button>,
                  ]
                : null
            }
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
      <Live
        visible={liveVisible}
        url={''}
        onCancel={() => {
          setLiveVisible(false);
        }}
      />
    </PageContainer>
  );
};
