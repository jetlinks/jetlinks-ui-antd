import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import type { ScreenItem } from '@/pages/visualization/Screen/typings';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { ConfigurationItem } from '@/pages/visualization/Configuration/typings';
import { Tooltip } from 'antd';
import {
  ArrowDownOutlined,
  BarsOutlined,
  CopyOutlined,
  EditOutlined,
  EyeOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';

export const service = new BaseService<ScreenItem>('visualization');

const Screen = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ConfigurationItem>[] = [
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
      dataIndex: 'state',
      title: '状态',
      render: (text, record) => record.state.value,
    },
    {
      dataIndex: 'description',
      title: '描述',
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
          <Tooltip title="预览">
            <EyeOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip title="下载配置">
            <ArrowDownOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip title="复制">
            <CopyOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip title="通知记录">
            <BarsOutlined />
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
        defaultParams={{ type: 'big_screen' }}
        columns={columns}
        service={service}
        title="大屏管理"
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Screen;
