import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Tooltip } from 'antd';
import { ArrowDownOutlined, BugOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import BaseService from '@/utils/BaseService';
import type { DeviceItem } from '@/pages/media/Device/typings';

export const service = new BaseService<DeviceItem>('media/device');
const Device = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<DeviceItem>[] = [
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
      dataIndex: 'transport',
      title: '信令传输',
    },
    {
      dataIndex: 'streamMode',
      title: '流传输模式',
    },
    {
      dataIndex: 'channelNumber',
      title: '通道数',
    },
    {
      dataIndex: 'state',
      title: '状态',
      render: (text, record) => record.state.value,
    },
    {
      dataIndex: 'host',
      title: 'IP',
    },
    {
      dataIndex: '端口',
      title: 'port',
    },
    {
      dataIndex: 'manufacturer',
      title: '设备厂家',
    },
    {
      dataIndex: 'model',
      title: '型号',
    },
    {
      dataIndex: 'firmware',
      title: '固件版本',
    },
    {
      dataIndex: 'networkType',
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
        <a onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            })}
          >
            <MinusOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.download',
              defaultMessage: '下载配置',
            })}
          >
            <ArrowDownOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.notice.option.debug',
              defaultMessage: '调试',
            })}
          >
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
        title="国标设备"
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Device;
