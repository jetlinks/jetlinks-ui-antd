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
  propertiesInfo: any;
}

const PropertiesInfo: React.FC<Props> = props => {
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
        ellipsis: true,
      },
    ],
    propertiesInfo: {},
  };

  const [propertiesInfo, setPropertiesInfo] = useState(initState.propertiesInfo);

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
        if (response.status === 200) {
          setPropertiesInfo(response.result);
        }
      })
      .catch(() => {
      });
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
        setPropertiesInfo(response.result);
      })
      .catch(() => {
      });
  };

  return (
    <Modal
      title="属性详情"
      visible
      onCancel={() => props.close()}
      onOk={() => props.close()}
      width="70%"
    >
      <Table
        rowKey="createTime"
        dataSource={propertiesInfo.data}
        size="small"
        onChange={onTableChange}
        pagination={{
          current: propertiesInfo.pageIndex + 1,
          total: propertiesInfo.total,
          pageSize: propertiesInfo.pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total: number) =>
            `共 ${total} 条记录 第  ${propertiesInfo.pageIndex + 1}/${Math.ceil(
              propertiesInfo.total / propertiesInfo.pageSize,
            )}页`,
        }}
        columns={initState.eventColumns}
      />
    </Modal>
  );
};

export default PropertiesInfo;
