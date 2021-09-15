import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import { useRef } from 'react';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import moment from 'moment';
import { Modal, Tag, Tooltip } from 'antd';
import BaseCrud from '@/components/BaseCrud';
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';

const service = new BaseService<AlarmItem>('device/alarm/history');
const Alarm = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<AlarmItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.deviceID',
        defaultMessage: '设备ID',
      }),
      dataIndex: 'deviceId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.equipmentName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'deviceName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.alarmName',
        defaultMessage: '告警名称',
      }),
      dataIndex: 'alarmName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.alarmTime',
        defaultMessage: '告警时间',
      }),
      dataIndex: 'alarmTime',
      width: '300px',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.status',
        defaultMessage: '处理状态',
      }),
      dataIndex: 'state',
      align: 'center',
      width: '100px',
      render: (text) =>
        text === 'solve' ? <Tag color="#87d068">已处理</Tag> : <Tag color="#f50">未处理</Tag>,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      width: '120px',
      align: 'center',
      valueType: 'option',
      render: (record: any) => [
        <a
          onClick={() => {
            let content: string;
            try {
              content = JSON.stringify(record.alarmData, null, 2);
            } catch (error) {
              content = record.alarmData;
            }
            Modal.confirm({
              width: '40VW',
              title: '告警数据',
              content: (
                <pre>
                  {content}
                  {record.state === 'solve' && (
                    <>
                      <br />
                      <br />
                      <span style={{ fontSize: 16 }}>处理结果：</span>
                      <br />
                      <p>{record.description}</p>
                    </>
                  )}
                </pre>
              ),
              okText: '确定',
              cancelText: '关闭',
            });
          }}
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
        </a>,
        <>
          {record.state !== 'solve' && (
            <a onClick={() => {}}>
              <Tooltip title={'处理'}>
                <CheckOutlined />
              </Tooltip>
            </a>
          )}
        </>,
      ],
    },
  ];

  const schema = {};

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={'告警记录'}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};

export default Alarm;
