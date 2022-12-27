import type { ProColumns } from '@jetlinks/pro-table';
import type { MetadataItem } from '@/pages/device/Product/typings';
import { Tag } from 'antd';

const SourceMap = {
  device: '设备',
  manual: '手动',
  rule: '规则',
};

const BaseColumns: ProColumns<MetadataItem>[] = [
  // {
  //   dataIndex: 'index',
  //   valueType: 'indexBorder',
  //   width: 48,
  // },
  {
    title: '标识',
    dataIndex: 'id',
    ellipsis: true,
  },
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '说明',
    dataIndex: 'description',
    ellipsis: true,
  },
];

const type = {
  read: '读',
  write: '写',
  report: '上报',
};

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
  // {
  //   title: '读写类型',
  //   dataIndex: 'expands',
  //   render: (text: any) => (text?.type || []).map((item: string | number) => <Tag>{type[item]}</Tag>),
  // },
]);

const PropertyColumns: ProColumns<MetadataItem>[] = BaseColumns.concat([
  {
    title: '数据类型',
    dataIndex: 'valueType',
    render: (text: any) => text?.type,
  },
  {
    title: '属性来源',
    dataIndex: 'expands',
    render: (text: any) => SourceMap[text?.source],
  },
  {
    title: '读写类型',
    dataIndex: 'expands',
    render: (text: any) =>
      (text?.type || []).map((item: string | number) => <Tag>{type[item]}</Tag>),
  },
]);

const TagColumns: ProColumns<MetadataItem>[] = BaseColumns.concat([
  {
    title: '数据类型',
    dataIndex: 'valueType',
    render: (text: any) => text?.type,
  },
  {
    title: '读写类型',
    dataIndex: 'expands',
    render: (text: any) =>
      (text?.type || []).map((item: string | number) => <Tag>{type[item]}</Tag>),
  },
]);

const MetadataMapping = new Map<string, ProColumns<MetadataItem>[]>();
MetadataMapping.set('properties', PropertyColumns);
MetadataMapping.set('events', EventColumns);
MetadataMapping.set('tags', TagColumns);
MetadataMapping.set('functions', FunctionColumns);

export default MetadataMapping;
