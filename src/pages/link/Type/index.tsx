import BaseService from '@/utils/BaseService';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Tooltip } from 'antd';
import { BugOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import BaseCrud from '@/components/BaseCrud';
import type { NetworkItem } from '@/pages/link/Type/typings';

export const service = new BaseService<NetworkItem>('network/config');

const Network = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<NetworkItem>[] = [
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
      dataIndex: 'type',
      title: '类型',
    },
    {
      dataIndex: 'state',
      title: '状态',
      render: (text, record) => record.state.value,
    },
    {
      dataIndex: 'provider',
      title: '服务商',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <a onClick={() => console.log(record)}>
          <Tooltip title="编辑">
            <EditOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip title="删除">
            <MinusOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip title="调试">
            <BugOutlined />
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
        title="网络组建"
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};

export default Network;
