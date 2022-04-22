import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import { service } from '@/pages/media/Cascade';
import { PageContainer } from '@ant-design/pro-layout';

interface Props {
  data: string;
  close: () => void;
}

const Logger = (props: Props) => {
  const [param, setParam] = useState<any>({
    terms: [
      {
        column: 'id',
        termType: 'cascade_channel$not',
        value: props.data,
        type: 'and',
      },
      {
        column: 'catalogType',
        termType: 'eq',
        value: 'device',
        type: 'and',
      },
    ],
    sorts: [
      {
        name: 'name',
        order: 'asc',
      },
    ],
  });
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'deviceName',
      title: '告警时间',
    },
    {
      dataIndex: 'name',
      title: '告警名称',
    },
    {
      dataIndex: 'address',
      title: '告警设备',
    },
    {
      dataIndex: 'manufacturer',
      title: '说明',
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<any>
        field={columns}
        target="bind-channel"
        enableSave={false}
        onSearch={(data) => {
          actionRef.current?.reload();
          const terms = [
            {
              column: 'id',
              termType: 'cascade_channel$not',
              value: props.data,
              type: 'and',
            },
            {
              column: 'catalogType',
              termType: 'eq',
              value: 'device',
              type: 'and',
            },
          ];
          setParam({
            ...param,
            terms: data?.terms ? [...data?.terms, ...terms] : [...terms],
          });
        }}
      />
      <ProTable<any>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        headerTitle={'记录列表'}
        request={async (params) => {
          return service.queryChannel({ ...params, sorts: [{ name: 'name', order: 'desc' }] });
        }}
        rowKey="id"
      />
    </PageContainer>
  );
};
export default Logger;
