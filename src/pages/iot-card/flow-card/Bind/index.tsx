import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Badge, message, Modal, Table } from 'antd';
import apis from '@/services';
import styles from '@/utils/table.less';
import Search from '@/pages/device/gateway/Search';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
  selectionType: string;
  close: Function;
  reload: Function;
  data: any;
  select: any;
}

interface State {
  searchParam: any;
  deviceData: any;
  deviceId: any[];
}

const Bind: React.FC<Props> = props => {
  const initState: State = {
    searchParam: {
      pageSize: 10,
      terms: {},
      sorts: {
        field: 'registryTime',
        order: 'desc',
      },
    },
    deviceData: {},
    deviceId: [],
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [deviceData, setDeviceData] = useState(initState.deviceData);
  const [deviceId, setDeviceId] = useState(initState.deviceId);

  const submitData = () => {
    if (deviceId.length !== 1) {
      message.warn('请选择一条数据')
      return
    }
    apis.flowCard
      .bindDevice(props.data.id, deviceId[0])
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          props.close()
          props.reload()
        }
      })
      .catch(() => { });
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
      .catch(() => { });
  };

  useEffect(() => {
    handleSearch(searchParam);
    if (props.selectionType === 'radio' && props.data.deviceId) {
      setDeviceId([props.data.deviceId])
    }
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
      .catch(() => { });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setDeviceId(selectedRowKeys);
    },
    selectedRowKeys: deviceId
  };

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未启用', 'processing');

  const columns: ColumnProps<any>[] = [
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
    },
  ];

  return (
    <Modal
      title="绑定设备"
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
              type: props.selectionType,
              ...rowSelection
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

export default Form.create<Props>()(Bind);
