import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import type { InstanceItem } from '@/pages/rule-engine/Instance/typings';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  CaretRightOutlined,
  EditOutlined,
  EyeOutlined,
  MinusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import BaseCrud from '@/components/BaseCrud';

export const service = new BaseService<InstanceItem>('rule-engine/instance');
const Instance = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<InstanceItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      dataIndex: 'modelType',
      title: '类型',
    },
    {
      dataIndex: 'state',
      title: '状态',
      render: (text, record) => record.state.value,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <a>
          <Tooltip title="查看">
            <EyeOutlined />
          </Tooltip>
        </a>,
        <a onClick={() => console.log(record)}>
          <Tooltip title="编辑">
            <EditOutlined />
          </Tooltip>
        </a>,
        <a onClick={() => console.log(record)}>
          <Tooltip title="启动">
            <CaretRightOutlined />
          </Tooltip>
        </a>,
        <a onClick={() => console.log(record)}>
          <Tooltip title="重启">
            <ReloadOutlined />
          </Tooltip>
        </a>,

        <a>
          <Tooltip title="删除">
            <MinusOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];

  const schema = {};

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title="规则实例"
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Instance;
