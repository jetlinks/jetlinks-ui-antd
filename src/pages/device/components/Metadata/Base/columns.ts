import type { ProColumns } from '@jetlinks/pro-table';
import type { MetadataItem } from '@/pages/device/Product/typings';

const BaseColumns: ProColumns<MetadataItem>[] = [
  // {
  //   dataIndex: 'index',
  //   valueType: 'indexBorder',
  //   width: 48,
  // },
  {
    title: '标识',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '说明',
    dataIndex: 'description',
    ellipsis: true,
  },
];

const EventColumns: ProColumns<MetadataItem>[] = BaseColumns.concat([
  {
    title: '事件级别',
    dataIndex: 'expands',
    render: (text: any) => {
      const map = {
        ordinary: '普通',
        warn: '警告',
        urgent: '紧急',
      };
      return map[text?.level] || '-';
    },
  },
]);

const FunctionColumns: ProColumns<MetadataItem>[] = BaseColumns.concat([
  {
    title: '是否异步',
    dataIndex: 'async',
    render: (text) => (text ? '是' : '否'),
  },
  {
    title: '是否只读',
    dataIndex: 'expands.readOnly',
    render: (text) => (text ? '是' : '否'),
  },
]);

const PropertyColumns: ProColumns<MetadataItem>[] = BaseColumns.concat([
  {
    title: '数据类型',
    dataIndex: 'valueType',
    render: (text: any) => text?.type,
  },
  {
    title: '是否只读',
    dataIndex: 'expands.readOnly',
    render: (text) => (text === 'true' || text === true ? '是' : '否'),
  },
]);

const TagColumns: ProColumns<MetadataItem>[] = BaseColumns.concat([
  {
    title: '数据类型',
    dataIndex: 'valueType',
    render: (text: any) => text?.type,
  },
  {
    title: '是否只读',
    dataIndex: 'expands.readOnly',
    render: (text) => (text === 'true' || text === true ? '是' : '否'),
  },
]);

const MetadataMapping = new Map<string, ProColumns<MetadataItem>[]>();
MetadataMapping.set('properties', PropertyColumns);
MetadataMapping.set('events', EventColumns);
MetadataMapping.set('tags', TagColumns);
MetadataMapping.set('functions', FunctionColumns);

export default MetadataMapping;
