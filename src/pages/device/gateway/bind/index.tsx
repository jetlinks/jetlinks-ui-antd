import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Badge, Modal, Table } from 'antd';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import apis from '@/services';
import { DeviceInstance } from '../../instance/data.d';
import styles from '@/utils/table.less';
import Search from '@/pages/device/gateway/Search';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
  selectionType: string;
  close: Function;
  save: Function;
  gatewayId: string;
}

interface State {
  searchParam: any;
  deviceData: any;
  deviceId: any[];
}

const DeviceGatewayBind: React.FC<Props> = props => {
  const initState: State = {
    searchParam: { pageSize: 10, terms: { 'parentId$not@or': props.gatewayId } },
    deviceData: {},
    deviceId: [],
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [deviceData, setDeviceData] = useState(initState.deviceData);
  const [deviceId, setDeviceId] = useState(initState.deviceId);

  const submitData = () => {
    props.save(deviceId);
  };

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.deviceInstance
      .list(encodeQueryParam(params))
      .then(response => {
        if (response.status === 200) {
          setDeviceData(response.result);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (props.selectionType === 'checkbox') {
      searchParam.terms = { parentId$isnull: 1, 'parentId$not@or': props.gatewayId };
    }
    handleSearch(searchParam);
  }, []);

  const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>) => {
    apis.deviceInstance
      .list(
        encodeQueryParam({
          terms: searchParam.terms,
          pageIndex: Number(pagination.current) - 1,
          pageSize: pagination.pageSize,
          sorts: sorter,
        }),
      )
      .then(response => {
        if (response.status === 200) {
          setDeviceData(response.result);
        }
      })
      .catch(() => {});
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setDeviceId(selectedRowKeys);
    },
  };

  const statusMap = new Map();
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

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
      ellipsis: true,
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '120px',
      render: record =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
    },
  ];

  return (
    <Modal
      title="绑定子设备"
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      width="60%"
      style={{ marginTop: -30 }}
      onCancel={() => props.close()}
    >
      <div
        className={styles.tableList}
        style={{ maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' }}
      >
        <div className={styles.tableListForm}>
          <Search
            search={(params: any) => {
              setSearchParam(params);
              if (props.selectionType === 'checkbox') {
                // params['parentId$isnull'] = 1;
                handleSearch({
                  sorter: searchParam.sorter, 
                  pageSize: 10,
                  terms:{
                    ...params,
                    parentId$isnull:1,
                    'parentId$not@or':props.gatewayId
                  },
                })
              }else{
                handleSearch({
                  sorter: searchParam.sorter, 
                  pageSize: 10,
                  terms:{
                    ...params,
                    // parentId$isnull:1,
                    'parentId$not@or':props.gatewayId
                  },
                })
              }
              // params['parentId$not@or'] = props.gatewayId;
              // handleSearch({ terms: params, sorter: searchParam.sorter, pageSize: 10 });
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
              type: props.selectionType,
              ...rowSelection,
            }}
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
    </Modal>
  );
};

export default connect(({ deviceGateway, loading }: ConnectState) => ({
  deviceGateway,
  loading,
}))(Form.create<Props>()(DeviceGatewayBind));
