import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import moment from 'moment';
import { Badge, message, Popconfirm, Tooltip } from 'antd';
import { useRef } from 'react';
import BaseCrud from '@/components/BaseCrud';
import { Link } from 'umi';
import {
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { CurdModel } from '@/components/BaseCrud/model';
import { model } from '@formily/reactive';
import Service from '@/pages/device/Instance/service';

const statusMap = new Map();
statusMap.set('在线', 'success');
statusMap.set('离线', 'error');
statusMap.set('未激活', 'processing');
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'processing');

export const InstanceModel = model<{
  current: DeviceInstance | undefined;
  detail: Partial<DeviceInstance>;
  config: any;
}>({
  current: undefined,
  detail: {},
  config: {},
});
export const service = new Service('device/instance');
const Instance = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
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
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <Link
          onClick={() => {
            InstanceModel.current = record;
          }}
          to={`/device/instance/detail/${record.id}`}
          key="link"
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.detail',
              defaultMessage: '查看',
            })}
            key={'detail'}
          >
            <EyeOutlined />
          </Tooltip>
        </Link>,
        <a key="editable" onClick={() => CurdModel.update(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,

        <a href={record.id} target="_blank" rel="noopener noreferrer" key="view">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.disable.tips',
              defaultMessage: '确认禁用？',
            })}
            onConfirm={async () => {
              await service.update({
                id: record.id,
                // status: record.state?.value ? 0 : 1,
              });
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: `pages.data.option.${record.state.value ? 'disable' : 'enable'}`,
                defaultMessage: record.state.value ? '禁用' : '启用',
              })}
            >
              {record.state.value ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
            </Tooltip>
          </Popconfirm>
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
        title={'设备管理'}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Instance;
