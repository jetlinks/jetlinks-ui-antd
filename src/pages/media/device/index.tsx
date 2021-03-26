import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Badge, Button, Card, Divider, message, Popconfirm} from 'antd';
import React, {Fragment, useEffect, useState} from 'react';
import styles from '@/utils/table.less';
import SearchForm from '@/components/SearchForm';
import ProTable from '@/pages/system/permission/component/ProTable';
import {ColumnProps} from 'antd/lib/table';
import Service from './service';
import encodeQueryParam from '@/utils/encodeParam';
import {router} from 'umi';
import DeviceUpdate from './edit/index';
import moment from 'moment';

interface Props {
}

interface State {
  searchParam: any;
}

const initState: State = {
  searchParam: {
    pageSize: 10,
    terms: location?.query?.terms,
    sorts: {field: 'id', order: 'desc'},
  },
};
const MediaDevice: React.FC<Props> = () => {
  const service = new Service('media/device');
  const [loading, setLoading] = useState<boolean>(false);
  const [deviceUpdate, setDeviceUpdate] = useState<boolean>(false);
  const [deviceData, setDeviceData] = useState<any>({});
  const [result, setResult] = useState<any>({});

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const statusMap = new Map();
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

  const streamMode = new Map();
  streamMode.set('UDP', 'UDP');
  streamMode.set('TCP_ACTIVE', 'TCP主动');
  streamMode.set('TCP_PASSIVE', 'TCP被动');

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    setLoading(true);
    service.query(encodeQueryParam(params)).subscribe(
      data => setResult(data),
      () => {
      },
      () => setLoading(false),
    );
  };

  const columns: ColumnProps<any>[] = [
    {
      title: '国标设备编号',
      dataIndex: 'id',
      width: 200,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      render: (record: any) => (record ? record : result.id),
      ellipsis: true,
    },
    {
      title: '信令传输',
      dataIndex: 'transport',
      width: 90,
      ellipsis: true,
    },
    {
      title: '流传输模式',
      dataIndex: 'streamMode',
      width: 110,
      render: record => (record ? streamMode.get(record) : '/'),
      ellipsis: true,
    },
    {
      title: '通道数',
      dataIndex: 'channelNumber',
      width: 100,
      ellipsis: true,
    },
    {
      title: '设备状态',
      dataIndex: 'state',
      width: 110,
      render: record =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text}/> : '/',
      filters: [
        {
          text: '未启用',
          value: 'notActive',
        },
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
      title: '设备IP',
      dataIndex: 'host',
      ellipsis: true,
      width: 150,
    },
    {
      title: '设备端口',
      dataIndex: 'port',
      width: 90,
      ellipsis: true,
    },
    {
      title: '设备厂家',
      dataIndex: 'manufacturer',
      ellipsis: true,
    },
    {
      title: '设备型号',
      dataIndex: 'model',
      ellipsis: true,
    },
    {
      title: '固件版本',
      dataIndex: 'firmware',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'center',
      fixed: 'right',
      width: 260,
      render: (record: any) => (
        <Fragment>
          <a
            onClick={() => {
              router.push(`/device/instance/save/${record.id}`);
            }}
          >
            查看
          </a>
          <Divider type="vertical"/>
          <a
            onClick={() => {
              setDeviceData(record);
              setDeviceUpdate(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical"/>
          <a
            onClick={() => {
              router.push(`/media/device/channel/${record.id}`);
            }}
          >
            查看通道
          </a>
          <Divider type="vertical"/>
          {record.state.value === 'online' ? (
            <a
              onClick={() => {
                setLoading(true);
                service._sync(record.id).subscribe(
                  () => {
                    message.success('通道更新成功');
                  },
                  () => {
                    message.error('通道更新失败');
                  },
                  () => setLoading(false),
                );
              }}
            >
              更新通道
            </a>
          ):(
            <Popconfirm
              placement="topRight"
              title="确定删除此国标设备吗？"
              onConfirm={() => {
                setLoading(true);
                service.remove(record.id).subscribe(
                  () => {
                    message.success('国标设备删除成功');
                  },
                  () => {
                    message.error('国标设备删除失败');
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
      ),
    },
  ];
  return (
    <PageHeaderWrapper title="国标设备">
      <Card style={{marginBottom: 16, height: 92}}>
        <div className={styles.tableList} style={{marginTop: -22}}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({
                  terms: {...params},
                  pageSize: 10,
                  sorts: {field: 'id', order: 'desc'},
                });
              }}
              formItems={[
                {
                  label: '设备名称',
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
          <ProTable
            loading={loading}
            dataSource={result?.data}
            columns={columns}
            rowKey="id"
            scroll={{x: '150%'}}
            onSearch={(params: any) => {
              params.pageSize = 10;
              params.sorts = params.sorts.field ? params.sorts : {field: 'id', order: 'desc'};
              handleSearch(params);
            }}
            paginationConfig={result}
          />
        </div>
      </Card>
      {deviceUpdate && (
        <DeviceUpdate
          close={() => {
            setDeviceUpdate(false);
            handleSearch(searchParam);
          }}
          data={deviceData}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default MediaDevice;
