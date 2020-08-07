import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Badge, Table } from 'antd';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import apis from '@/services';
import { DeviceInstance } from '@/pages/device/instance/data.d';
import styles from '@/utils/table.less';
import Search from '@/pages/device/firmware/editor/detail/upgrade/Search';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
  save: Function;
  productId?: string
}

interface State {
  searchParam: any;
  deviceData: any;
}

const ChoiceDevice: React.FC<Props> = props => {
  const initState: State = {
    searchParam: { pageSize: 10 },
    deviceData: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [deviceData, setDeviceData] = useState(initState.deviceData);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.deviceInstance
      .list(encodeQueryParam(params))
      .then(response => {
        if (response.status === 200) {
          setDeviceData(response.result);
        }
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    searchParam.terms = { productId: props.productId };
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
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: record =>
        record ? <Badge status={statusMap.get(record.text)} text={record.text}/> : '',
    },
  ];

  return (
    <div className={styles.tableList}>
      <div className={styles.tableListForm}>
        <Search
          search={(params: any) => {
            setSearchParam(params);
            searchParam.terms = { productId: props.productId };
            handleSearch({ terms: params, sorter: searchParam.sorter, pageSize: 10 });
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
  );
};

export default connect(({ deviceGateway, loading }: ConnectState) => ({
  deviceGateway,
  loading,
}))(Form.create<Props>()(ChoiceDevice));
