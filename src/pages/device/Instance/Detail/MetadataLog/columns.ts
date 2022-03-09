import type { ProColumns } from '@jetlinks/pro-table';
import moment from 'moment';

const columns: ProColumns<MetadataLogData>[] = [
  {
    dataIndex: 'timestamp',
    title: '时间',
    sorter: true,
    width: 200,
    renderText: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
];
export default columns;
