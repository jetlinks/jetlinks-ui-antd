import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import { PaginationConfig } from 'antd/lib/table';
import moment from 'moment';

interface Props {
  data: any;
}
interface State {
  list: any;
}

const Event: React.FC<Props> = props => {
  const initState: State = {
    list: {},
  };

  const [list, setList] = useState(initState.list);

  const handleSearch = (params?: any) => {
    apis.ruleInstance.event(props.data.id, encodeQueryParam(params)).then(response => {
      if (response.status === 200) {
        setList(response.result);
      }
    });
  };
  useEffect(() => {
    handleSearch({
      pageIndex: 0,
      pageSize: 10,
    });
  }, []);

  const onTableChange = (pagination: PaginationConfig) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      sorts: {
        field: 'createTime',
        order: 'desc',
      },
      // terms: { property: props.item.id }
    });
  };

  return (
    <Table
      rowKey="id"
      onChange={onTableChange}
      pagination={{
        current: list.pageIndex + 1,
        total: list.total,
        pageSize: list.pageSize,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total: number) =>
          `共 ${total} 条记录 第  ${list.pageIndex + 1}/${Math.ceil(list.total / list.pageSize)}页`,
      }}
      columns={[
        {
          dataIndex: 'createTime',
          title: '时间',
          render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          dataIndex: 'event',
          title: '事件',
        },
        {
          dataIndex: 'ruleData',
          title: '数据',
        },
      ]}
      dataSource={list}
    />
  );
};

export default Event;
