import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import { Badge, Modal } from 'antd';
import Table, { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import styles from '@/utils/table.less';
import SearchForm from '@/components/SearchForm';

interface Props {
  close: Function;
  save: Function;
  data: string[];
  productId: string;
}
const DeviceList = (props: Props) => {
  const [searchParam, setSearchParam] = useState({
    pageSize: 10,
    terms: { productId: props.productId },
  });
  const [deviceData, setDeviceData] = useState<any>({});
  const [deviceId, setDeviceId] = useState(props.data);

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
    handleSearch(searchParam);
  }, []);

  const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>) => {
    apis.deviceInstance
      .list(
        encodeQueryParam({
          pageIndex: Number(pagination.current) - 1,
          pageSize: pagination.pageSize,
          sorts: sorter,
          terms: { productId: props.productId },
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
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');

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
      title="选择设备"
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
          <SearchForm
            search={(params: any) => {
              handleSearch({ terms: { ...searchParam.terms, ...params }, pageSize: 10 });
            }}
            formItems={[
              {
                label: '设备名称',
                key: 'name$LIKE',
                type: 'string',
              },
              {
                label: '设备ID',
                key: 'deviceId$IN',
                type: 'string',
              },
            ]}
          />
        </div>

        <div className={styles.StandardTable}>
          <Table
            columns={columns}
            dataSource={deviceData.data}
            rowKey="id"
            onChange={onTableChange}
            rowSelection={{
              selectedRowKeys: deviceId,
              type: 'checkbox',
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

export default DeviceList;
