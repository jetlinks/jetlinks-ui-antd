import type { EventMetadata } from '@/pages/device/Product/typings';
import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';

const Event = () => {
  const columns: ProColumns<EventMetadata>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '标识',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '事件级别',
      dataIndex: 'expands.level',
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
  ];

  return <ProTable columns={columns} rowKey="id" search={false} />;
};
export default Event;
