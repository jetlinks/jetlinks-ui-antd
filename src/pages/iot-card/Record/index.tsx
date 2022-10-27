import SearchComponent from '@/components/SearchComponent';
import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import moment from 'moment';
import { useRef, useState } from 'react';
import Service from './service';

export const service = new Service('');

const Record = () => {
  const { minHeight } = useDomFullHeight(`.record`, 24);
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'cardId',
      title: '卡号',
    },
    {
      dataIndex: 'type',
      title: '操作类型',
    },
    {
      dataIndex: 'time',
      title: '操作时间',
      valueType: 'dateTime',
      render: (_: any, record) => {
        return record.time ? moment(record.time).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      dataIndex: 'operator',
      title: '操作人',
    },
  ];

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        target="record"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        rowKey="id"
        tableClassName={'record'}
        columnEmptyText={''}
        tableStyle={{ minHeight }}
        request={async (params) =>
          service.getList({ ...params, sorts: [{ name: 'time', order: 'desc' }] })
        }
      />
    </PageContainer>
  );
};
export default Record;
