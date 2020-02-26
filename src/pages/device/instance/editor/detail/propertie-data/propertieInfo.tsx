import React, { useState, useEffect } from 'react';
import { Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
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
  propertieInfo: any;
}

const PropertieInfo: React.FC<Props> = props => {
  const initState: State = {
    eventColumns: [
      {
        title: '时间',
        dataIndex: 'timestamp',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: props.item.name,
        dataIndex: 'formatValue',
      },
    ],
    propertieInfo: {},
  };

  const [propertieInfo, setPropertieInfo] = useState(initState.propertieInfo);

  useEffect(() => {
    apis.deviceInstance
      .propertieInfo(
        props.deviceId,
        encodeQueryParam({
          pageIndex: 0,
          pageSize: 10,
          sorts: {
            field: 'timestamp',
            order: 'desc',
          },
          terms: { property: props.item.id },
        }),
      )
      .then(response => {
        setPropertieInfo(response.result);
      })
      .catch(() => {});
  }, []);

  const onTableChange = (pagination: PaginationConfig) => {
    apis.deviceInstance
      .propertieInfo(
        props.deviceId,
        encodeQueryParam({
          pageIndex: Number(pagination.current) - 1,
          pageSize: pagination.pageSize,
          sorts: {
            field: 'timestamp',
            order: 'desc',
          },
          terms: { property: props.item.id },
        }),
      )
      .then(response => {
        setPropertieInfo(response.result);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="属性详情"
      visible
      onCancel={() => props.close()}
      onOk={() => props.close()}
      width={1600}
    >
      <Table
        rowKey="createTime"
        dataSource={propertieInfo.data}
        size="small"
        onChange={onTableChange}
        pagination={{
          current: propertieInfo.pageIndex + 1,
          total: propertieInfo.total,
          pageSize: propertieInfo.pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total: number) =>
            `共 ${total} 条记录 第  ${propertieInfo.pageIndex + 1}/${Math.ceil(
              propertieInfo.total / propertieInfo.pageSize,
            )}页`,
        }}
        columns={initState.eventColumns}
      />
    </Modal>
  );
};

export default PropertieInfo;
