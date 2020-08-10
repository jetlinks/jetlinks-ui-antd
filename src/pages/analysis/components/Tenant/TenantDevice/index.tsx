import React, {useEffect, useState} from 'react';
import styles from '@/utils/table.less';
import {Card, Spin, Table, Tag,} from 'antd';
import {ColumnProps, PaginationConfig, SorterResult} from 'antd/lib/table';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import Search from './Search';
import {DeviceInstance} from '@/pages/device/instance/data.d';
import {DeviceProduct} from '@/pages/device/product/data';

interface Props {

}

interface State {
  searchParam: any;
  productList: DeviceProduct[];
  deviceData: any;
}

const TenantDevice: React.FC<Props> = (props) => {
  const initState: State = {
    searchParam: {
      pageSize: 10, sorts: {
        order: "descend",
        field: "createTime"
      }
    },
    productList: [],
    deviceData: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [deviceData, setDeviceData] = useState(initState.deviceData);
  const [spinning, setSpinning] = useState(true);

  const statusMap = new Map();
  statusMap.set('online', <Tag color="#87d068">在线</Tag>);
  statusMap.set('offline', <Tag color="#f50">离线</Tag>);
  statusMap.set('notActive', <Tag color="#1890ff">未激活</Tag>);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.deviceInstance.list(encodeQueryParam(params))
      .then((response: any) => {
        if (response.status === 200) {
          setDeviceData(response.result);
        }
        setSpinning(false);
      })
      .catch(() => {
      })
  };

  const columns: ColumnProps<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '90px',
      render: record => record ? statusMap.get(record.value) : '',
      filters: [
        {
          text: '未激活',
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
  ];

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<DeviceInstance>,) => {
    setSpinning(true);
    let {terms} = searchParam;
    if (filters.state) {
      if (terms) {
        terms.state = filters.state[0];
      } else {
        terms = {
          state: filters.state[0],
        };
      }
    }
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms,
      sorts: sorter,
    });
  };

  return (
    <Spin spinning={spinning}>
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Search
              search={(params: any) => {
                setSpinning(true);
                params.state = searchParam.terms?.state;
                handleSearch({terms: params, pageSize: 10, sorts: searchParam.sorts});
              }}
            />
          </div>
          <div className={styles.StandardTable} style={{marginTop: 10}}>
            <Table
              size='middle'
              columns={columns}
              dataSource={(deviceData || {}).data}
              rowKey="id"
              onChange={onTableChange}
              pagination={{
                current: deviceData.pageIndex + 1,
                total: deviceData.total,
                pageSize: deviceData.pageSize,
              }}
            />
          </div>
        </div>
      </Card>
    </Spin>
  );
};

export default TenantDevice;
