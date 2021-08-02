import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import { Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { useRef } from 'react';
import BaseCrud from '@/components/BaseCrud';

const service = new BaseService('firmware');

const Firmware = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<FirmwareItem>[] = [
    {
      title: '固件名称',
      dataIndex: 'name',
    },
    {
      title: '固件版本',
      dataIndex: 'version',
    },
    {
      title: '所属产品',
      dataIndex: 'productName',
    },
    {
      title: '签名方式',
      dataIndex: 'signMethod',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '200px',
      align: 'center',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      width: '300px',
      align: 'center',
      renderText: () => (
        <>
          <a
            onClick={() => {
              // router.push(`/device/firmware/save/${record.id}`);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a onClick={() => {}}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除？" onConfirm={() => {}}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const schema = {};

  return (
    <PageContainer>
      <BaseCrud<FirmwareItem>
        columns={columns}
        service={service}
        title={'固件升级'}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Firmware;
