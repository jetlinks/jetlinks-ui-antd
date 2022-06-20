import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import moment from 'moment';
import { Form, Input, Modal, Tag, Tooltip } from 'antd';
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import { onlyMessage } from '@/utils/util';

const service = new BaseService<AlarmItem>('device/alarm/history');
const Alarm = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const [form] = Form.useForm();
  const columns: ProColumns<AlarmItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.deviceId',
        defaultMessage: '设备ID',
      }),
      dataIndex: 'deviceId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.deviceName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'deviceName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.name',
        defaultMessage: '告警名称',
      }),
      dataIndex: 'alarmName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.time',
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
      render: (text, record: any) => [
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
              title: intl.formatMessage({
                id: 'pages.device.alarm.option.data',
                defaultMessage: '告警数据',
              }),
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
            <a
              onClick={() => {
                Modal.confirm({
                  title: '处理告警',
                  width: '30vw',
                  icon: <CheckOutlined />,
                  content: (
                    <Form form={form}>
                      <Form.Item name="handle">
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </Form>
                  ),
                  onOk: async () => {
                    const values = await form.getFieldsValue();
                    const resp = await request(
                      `/${SystemConst.API_BASE}/device/alarm/history/${record.id}/_solve`,
                      {
                        method: 'put',
                        data: values.handle,
                      },
                    );
                    if (resp.status === 200) {
                      onlyMessage('操作成功');
                    } else {
                      onlyMessage('操作失败', 'error');
                    }
                    actionRef.current?.reload();
                  },
                });
              }}
            >
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.device.alarm.option.dispose',
                  defaultMessage: '处理',
                })}
              >
                <CheckOutlined />
              </Tooltip>
            </a>
          )}
        </>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        request={async (params) => service.query(params)}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};

export default Alarm;
