import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import moment from 'moment';
import { Badge, Divider, Popconfirm } from 'antd';
import { useRef } from 'react';
import BaseCrud from '@/components/BaseCrud';
import BaseService from '@/utils/BaseService';

const statusMap = new Map();
statusMap.set('在线', 'success');
statusMap.set('离线', 'error');
statusMap.set('未激活', 'processing');
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'processing');

const service = new BaseService<DeviceInstance>('device/instance');
const Instance = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '90px',
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      filters: [
        {
          text: '未启用',
          value: 'notActive',
        },
        {
          text: '离线',
          value: 'offline',
        },
        {
          text: '在线',
          value: 'online',
        },
      ],
      filterMultiple: false,
    },
    {
      title: '说明',
      dataIndex: 'describe',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '操作',
      width: '200px',
      align: 'center',
      render: (record: any) => (
        <>
          <a
            onClick={() => {
              // router.push(`/device/instance/save/${record.id}`);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              // setCurrentItem(record);
              // setAddVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          {record.state?.value === 'notActive' ? (
            <span>
              <Popconfirm
                title="确认启用？"
                onConfirm={() => {
                  // changeDeploy(record);
                }}
              >
                <a>启用</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除？"
                onConfirm={() => {
                  // deleteInstance(record);
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          ) : (
            <Popconfirm
              title="确认禁用设备？"
              onConfirm={() => {
                // unDeploy(record);
              }}
            >
              <a>禁用</a>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  const schema = {};

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={'设备管理'}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Instance;
