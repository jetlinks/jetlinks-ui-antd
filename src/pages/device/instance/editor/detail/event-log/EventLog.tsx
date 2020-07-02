import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import moment from 'moment';

interface Props {
  close: Function;
  item: any;
  type: string;
  deviceId: string;
}

interface State {
  eventColumns: ColumnProps<any>[];
  logData: any
}

const EventLog: React.FC<Props> = props => {

  const initState: State = {
    eventColumns: props.item.valueType.type === "object" ? props.item.valueType.properties?.map((item: any) => {
      return {
        title: item.name,
        dataIndex: `${item.id }_format`,
        ellipsis : true
      };
    }):[{
      title: "数据",
      dataIndex: `value`,
      ellipsis : true
    }],
    logData: {},
  };
  initState.eventColumns.push({
    title: '事件时间',
    dataIndex: 'createTime',
    width: '200px',
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    sorter: true,
    defaultSortOrder: 'descend',
  });

  const [logData, setLogData] = useState(initState.logData);


  useEffect(() => {
    apis.deviceInstance.eventData(
      props.deviceId,
      props.item.id,
      encodeQueryParam({
        pageIndex: 0,
        pageSize: 10,
      }),
    ).then(response => {
      setLogData(response.result);
    }).catch(() => {

    });
  }, []);

  const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>) => {
    apis.deviceInstance.eventData(
      props.deviceId,
      props.item.id,
      encodeQueryParam({
        pageIndex: Number(pagination.current) - 1,
        pageSize: pagination.pageSize,
        sorts: sorter,
      }),
    ).then(response => {
      setLogData(response.result);
    }).catch(() => {

    });
  };

  return (
    <Modal
      title="事件详情"
      visible
      onCancel={() => props.close()}
      onOk={() => props.close()}
      width="70%"
    >
      <Table
        rowKey='createTime'
        dataSource={logData.data}
        size="small"
        onChange={onTableChange}
        pagination={{
          current: logData.pageIndex + 1,
          total: logData.total,
          pageSize: logData.pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total: number) => `共 ${total} 条记录 第  ${  logData.pageIndex + 1  }/${  Math.ceil(logData.total / logData.pageSize)  }页`,
        }}
        columns={initState.eventColumns}
      />
    </Modal>
  );
};

export default EventLog;
