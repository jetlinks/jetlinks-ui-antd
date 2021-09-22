import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import type { CertificateItem } from '@/pages/link/Certificate/typings';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Tooltip } from 'antd';
import { EditOutlined, MinusOutlined } from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';

export const service = new BaseService<CertificateItem>('network/certificate');
const Certificate = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<CertificateItem>[] = [
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
      dataIndex: 'instance',
      title: '类型',
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
        title="证书管理"
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Certificate;
