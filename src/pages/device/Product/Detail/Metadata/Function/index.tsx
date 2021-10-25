import ProTable, { ProColumns } from '@jetlinks/pro-table';
import { FunctionMetadata } from '@/pages/device/Product/typings';

const Function = () => {
  const columns: ProColumns<FunctionMetadata>[] = [
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
      title: '是否异步',
      dataIndex: 'async',
    },
    {
      title: '是否只读',
      dataIndex: 'expands.readOnly',
      render: (text) => (text ? '是' : '否'),
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
  ];

  return <ProTable columns={columns} rowKey="id" search={false} />;
};
export default Function;
