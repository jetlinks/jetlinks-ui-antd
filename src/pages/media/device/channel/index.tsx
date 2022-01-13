import {PageHeaderWrapper} from "@ant-design/pro-layout"
import {Badge, Button, Card, Descriptions, Divider, message, Popconfirm, Row, Table} from "antd";
import React, {Fragment, useEffect, useState} from "react";
import styles from '@/utils/table.less';
import SearchForm from "@/components/SearchForm";
import {ColumnProps, PaginationConfig, SorterResult} from "antd/lib/table";
import Service from "../service";
import encodeQueryParam from "@/utils/encodeParam";
import {Dispatch} from "@/models/connect";
import Play from './play';
import Playback from './playback'
import ChannelEdit from './edit/index';
import {DeviceInstance} from "@/pages/device/instance/data";

interface Props {
  dispatch: Dispatch;
  location: Location;
}

interface State {
  searchParam: any;
}

const initState: State = {
  searchParam: {pageSize: 10, terms: location?.query?.terms, sorts: {field: 'id', order: 'desc'}},
};
const MediaDevice: React.FC<Props> = props => {
  const {location: {pathname},} = props;
  const service = new Service('media/channel');
  const [loading, setLoading] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [result, setResult] = useState<any>({});
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  const [channel, setChannel] = useState<boolean>(false);
  const [channelInfo, setChannelInfo] = useState<any>({});
  const [playing, setPlaying] = useState<boolean>(false);
  const [playback, setPalyback] = useState<boolean>(false)
  const [data, setData] = useState<any>({});

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const statusMap = new Map();
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

  const ptzType = new Map();
  ptzType.set(0, '未知');
  ptzType.set(1, '球体');
  ptzType.set(2, '半球体');
  ptzType.set(3, '固定枪机');
  ptzType.set(4, '遥控枪机');

  const deviceDetail = (deviceId: string) => {
    service.mediaDevice(deviceId).subscribe((data) => {
        setDeviceInfo(data);
      },
      () => {
      },
      () => {
      })
  };

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    setLoading(true);
    service.query(encodeQueryParam(params)).subscribe(
      data => setResult(data),
      () => {
      },
      () => setLoading(false));
  };


  const columns: ColumnProps<any>[] = [
    {
      title: '通道国标编号',
      dataIndex: 'channelId',
      ellipsis: true,
    },
    {
      title: '通道名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '厂商',
      dataIndex: 'manufacturer',
      width: 100,
      ellipsis: true,
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '云台类型',
      dataIndex: 'ptzType',
      width: 100,
      render: record => ptzType.get(record?.value || 0),
      ellipsis: true,
    },
    {
      title: '在线状态',
      dataIndex: 'status',
      width: 110,
      render: record => record ? <Badge status={statusMap.get(record.value)} text={record.text}/> : '',
      filters: [
        {
          text: '离线',
          value: 'offline',
        },
        {
          text: '在线',
          value: 'online',
        },
      ],
      filterMultiple: false,
    },
    {
      title: '经纬度',
      width: 200,
      ellipsis: true,
      render: (record: any) => (
        <span>{record.longitude ? `${record.longitude ? record.longitude : ''},${record.latitude ? record.latitude : ''}` : ''}</span>
      )
    },
    {
      title: '子通道数',
      dataIndex: 'subCount',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '10%',
      ellipsis: true
    },
    {
      title: '操作',
      align: 'center',
      // fixed: 'right',
      render: (record: any) => (
        <Fragment>
          <a
            onClick={() => {
              setChannel(true);
              setChannelInfo(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical"/>
          {record.status.value === 'online' ? (
            <>
              <a
                onClick={() => {
                  setPlaying(true);
                  setData(record)
                }}
              >
                播放
              </a>
              <Divider type="vertical"/>
              <a
                onClick={() => {
                  setPalyback(true);
                  setData(record)
                }}
              >
                回放
              </a>
            </>
          ) : (
            <Popconfirm
              placement="topRight"
              title="确定删除此通道吗？"
              onConfirm={() => {
                setLoading(true);
                service.remove(record.id).subscribe(
                  () => {
                    message.success('通道删除成功');
                  },
                  () => {
                    message.error('通道删除失败');
                  },
                  () => {
                    handleSearch(searchParam);
                    setLoading(false);
                  },
                );
              }}
            >
              <a>删除</a>
            </Popconfirm>
          )}
        </Fragment>
      )
    },
  ];

  useEffect(() => {
    if (pathname.indexOf('channel') > 0) {
      const list = pathname.split('/');
      deviceDetail(list[list.length - 1]);
      setDeviceId(list[list.length - 1]);
      searchParam.terms = {deviceId: list[list.length - 1]};
      handleSearch(searchParam);
    }
  }, [window.location.hash]);


  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<DeviceInstance>,
  ) => {
    const {terms} = searchParam;

    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: {...terms, ...filters},
      sorts: sorter,
    })
  };

  const content = (
    <div style={{marginTop: 30}}>
      <Descriptions column={4}>
        <Descriptions.Item label="设备名称">
          <div>
            {deviceInfo.name}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const titleInfo = (
    <Row>
      <div>
        <span style={{paddingRight: 20}}>
          通道列表：{deviceId}
        </span>
        <Badge status={statusMap.get(deviceInfo.state?.value)} text={deviceInfo.state?.text}/>
      </div>
    </Row>
  );

  return (
    <PageHeaderWrapper title={titleInfo} content={content}>
      <Card style={{height: 92, marginBottom: 16}}>
        <div className={styles.tableList} style={{marginTop: -22}}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                params ? params.deviceId = deviceId : params = {deviceId: deviceId};
                handleSearch({pageSize: 10, terms: {...params}, sorts: {field: 'id', order: 'desc'}});
              }}
              formItems={[
                {
                  label: '名称',
                  key: 'name$LIKE',
                  type: 'string',
                },
              ]}
            />
          </div>
        </div>
      </Card>
      <Card>
        <div className={styles.StandardTable}>
          <Table
            loading={loading}
            columns={columns}
            dataSource={(result || {}).data}
            rowKey="id"
            onChange={onTableChange}
            pagination={{
              current: result?.pageIndex + 1,
              total: result?.total,
              pageSize: result?.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${result?.pageIndex + 1}/${Math.ceil(
                  result?.total / result?.pageSize,
                )}页`,
            }}
          />
        </div>
      </Card>
      {playing && <Play data={data} close={() => {
        setPlaying(false)
      }} ok={() => {
        setPlaying(false)
      }}/>}

      {channel && <ChannelEdit data={channelInfo} close={() => {
        setChannel(false);
        handleSearch(searchParam);
      }}/>
      }
      {playback && <Playback data={data} close={() => {
        setPalyback(false)
      }} ok={() => {
        setPalyback(false)
      }} />}
    </PageHeaderWrapper>
  )
};
export default MediaDevice;
