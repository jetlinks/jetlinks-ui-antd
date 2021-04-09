import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Badge, Modal, Table } from 'antd';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import styles from '@/utils/table.less';
import { PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';
import encodeQueryParam from '@/utils/encodeParam';
import Service from '../../network/service';
import SearchForm from '@/components/SearchForm';

interface Props extends FormComponentProps {
  selectionType: string;
  close: Function;
  save: Function;
  deviceId: string;
}

interface State {
  searchParam: any;
  deviceData: any;
  deviceId: any[];
}

const DeviceGatewayBind: React.FC<Props> = props => {

  const service = new Service('device-network');
  const initState: State = {
    searchParam: { pageSize: 10 },
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
    service.getDeviceList(props.deviceId, params).subscribe(
      (res) => {
        setDeviceData(res)
      })
    // apis.deviceInstance
    //   .list(encodeQueryParam(params))
    //   .then(response => {
    //     if (response.status === 200) {
    //       setDeviceData(response.result);
    //     }
    //   })
    //   .catch(() => {
    //   });
  };

  useEffect(() => {
    if (props.selectionType === 'checkbox') {
      searchParam.terms = { parentId$isnull: 1 };
    }
    handleSearch(searchParam);
  }, []);

  const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>) => {
    service.getDeviceList(props.deviceId, encodeQueryParam({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      sorts: sorter,
    })).subscribe(
      (res) => {
        setDeviceData(res)
      })
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setDeviceId(selectedRowKeys);
    },
  };

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');

  const columns = [
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
        record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
    }
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
      <div className={styles.tableList} style={{ maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' }}>
        <div className={styles.tableListForm}>
          <SearchForm
            formItems={[
              {
                label: '名称',
                key: 'name',
                type: 'string',
              }
            ]}
            search={(params: any) => {
              if (params?.name) {
                setSearchParam({
                  where: `name like '%${params?.name}%'`,
                  pageSize: 10
                })
                handleSearch({
                  where: `name like '%${params?.name}%'`,
                  pageSize: 10
                });
              } else {
                setSearchParam({ pageSize: 10 })
                handleSearch({ pageSize: 10 });
              }
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
