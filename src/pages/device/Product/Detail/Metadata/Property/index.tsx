import type { ProColumns } from '@jetlinks/pro-table';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import ProTable from '@jetlinks/pro-table';

const Property = () => {
  const columns: ProColumns<PropertyMetadata>[] = [
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
      dataIndex: 'dataType',
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
export default Property;
