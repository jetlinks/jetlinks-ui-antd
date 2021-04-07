import React, {useEffect, useState} from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Badge, Spin, Table} from 'antd';
import apis from '@/services';
import {DeviceInstance} from '@/pages/device/instance/data.d';
import styles from '@/utils/table.less';
import Search from '@/pages/device/firmware/editor/detail/upgrade/Search';
import {ColumnProps, PaginationConfig, SorterResult} from 'antd/lib/table';
import moment from 'moment';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
  save: Function;
  parentId: string;
}

interface State {
  searchParam: any;
  deviceData: any;
  deviceList: any[];
}

const ChoiceDevice: React.FC<Props> = props => {
  const initState: State = {
    searchParam: {pageSize: 10, terms: {
      "id$dev-group$not": props.parentId
    }},
    deviceData: {},
    deviceList: []
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [deviceData, setDeviceData] = useState(initState.deviceData);
  const [deviceList, setDeviceList] = useState(initState.deviceList);
  const [spinning, setSpinning] = useState(true);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.deviceInstance
      .list(encodeQueryParam(params))
      .then(response => {
        if (response.status === 200) {
          setDeviceData(response.result);
        }
        setSpinning(false);
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<DeviceInstance>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setDeviceList(selectedRowKeys);
      props.save(selectedRowKeys);
    },
  };

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');

  const columns: ColumnProps<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '80px',
      render: record =>
        record ? <Badge status={statusMap.get(record.text)} text={record.text}/> : '',
    },
  ];

  return (
    <Spin spinning={spinning}>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <Search
            search={(params: any) => {
              setSearchParam({...searchParam, ...params});
              handleSearch({terms: {...searchParam.terms, ...params}, sorter: searchParam.sorter, pageSize: 10});
            }}
          />
        </div>
        <div className={styles.StandardTable}>
          <Table
            columns={columns}
            dataSource={deviceData.data}
            rowKey="id"
            onChange={onTableChange}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
              selectedRowKeys: deviceList
            }}
            size='middle'
            pagination={{
              current: deviceData.pageIndex + 1,
              total: deviceData.total,
              pageSize: deviceData.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${deviceData.pageIndex + 1}/${Math.ceil(
                  deviceData.total / deviceData.pageSize,
                )}页`,
            }}
          />
        </div>
      </div>
    </Spin>
  );
};

export default Form.create<Props>()(ChoiceDevice);

