// 视频设备列表
import { PageContainer } from '@ant-design/pro-layout';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Tooltip } from 'antd';
import { ArrowDownOutlined, BugOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import BaseService from '@/utils/BaseService';
import type { DeviceItem } from '@/pages/media/Device/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';

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
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    // {
    //   dataIndex: 'transport',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.transport',
    //     defaultMessage: '信令传输',
    //   }),
    // },
    // {
    //   dataIndex: 'streamMode',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.streamMode',
    //     defaultMessage: '流传输模式',
    //   }),
    // },
    // {
    //   dataIndex: 'channelNumber',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.channelNumber',
    //     defaultMessage: '通道数',
    //   }),
    // },
    // {
    //   dataIndex: 'host',
    //   title: 'IP',
    // },
    // {
    //   dataIndex: '端口',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.port',
    //     defaultMessage: '端口',
    //   }),
    // },
    // {
    //   dataIndex: 'manufacturer',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.manufacturer',
    //     defaultMessage: '设备厂家',
    //   }),
    // },
    // {
    //   dataIndex: 'model',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.model',
    //     defaultMessage: '型号',
    //   }),
    // },
    // {
    //   dataIndex: 'firmware',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.firmware',
    //     defaultMessage: '固件版本',
    //   }),
    // },
    // {
    //   dataIndex: 'networkType',
    //   title: intl.formatMessage({
    //     id: 'pages.table.type',
    //     defaultMessage: '类型',
    //   }),
    // },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (text, record) => (
        <BadgeStatus
          status={record.state.value}
          statusNames={{
            online: StatusColorEnum.success,
            offline: StatusColorEnum.error,
            notActive: StatusColorEnum.processing,
          }}
          text={text}
        />
      ),
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
        search={false}
        title={intl.formatMessage({
          id: 'pages.media.device',
          defaultMessage: '模拟测试',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Device;
