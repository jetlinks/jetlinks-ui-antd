import type { ProColumns } from '@jetlinks/pro-table';
import moment from 'moment';

const columns: ProColumns<MetadataLogData>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    dataIndex: 'timestamp',
    title: '时间',
    sorter: true,
    width: 200,
    renderText: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    dataIndex: 'formatValue',
    title: '数据',
    copyable: true,
  },
];
export default columns;
