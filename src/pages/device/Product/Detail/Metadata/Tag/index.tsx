import type { TagMetadata } from '@/pages/device/Product/typings';
import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';

const Tag = () => {
  const columns: ProColumns<TagMetadata>[] = [
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
      title: '数据类型',
      dataIndex: 'valueType',
    },
    {
      title: '是否只读',
      dataIndex: 'expands.readOnly',
      render: (text) => (text === 'true' || text === true ? '是' : '否'),
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
  ];

  return <ProTable columns={columns} rowKey="id" search={false} />;
};
export default Tag;
