import type { AlarmRecord } from '@/pages/device/Product/typings';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { service } from '@/pages/device/components/Alarm';
import { useParams } from 'umi';
import { Input, Modal, Tag, Tooltip } from 'antd';
import { AuditOutlined, EyeOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { onlyMessage } from '@/utils/util';

interface Props {
  type: 'device' | 'product';
}

const Record = (props: Props) => {
  const { type } = props;
  const intl = useIntl();
  const [handleText, setText] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<AlarmRecord>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.alarmLog.deviceId',
        defaultMessage: '设备ID',
      }),
      dataIndex: 'deviceId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.alarmLog.deviceName',
        defaultMessage: '设备ID',
      }),
      dataIndex: 'deviceName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.time',
        defaultMessage: '告警时间',
      }),
      valueType: 'dateTime',
      dataIndex: 'alarmTime',
      defaultSortOrder: 'descend',
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.status',
        defaultMessage: '处理状态',
      }),
      dataIndex: 'state',
      render: (text) =>
        text === 'solve' ? <Tag color="#87d068">已处理</Tag> : <Tag color="#f50">未处理</Tag>,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (_, record) => [
        <a
          key="info"
          onClick={async () =>
            Modal.info({
              title: '告警数据',
              width: 600,
              content: <pre>{JSON.stringify(record.alarmData, null, 2)}</pre>,
            })
          }
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '详情',
            })}
          >
            <EyeOutlined />
          </Tooltip>
        </a>,
        record.state !== 'solve' && (
          <a
            key="handle"
            onClick={() => {
              setVisible(true);
              setId(record.id);
            }}
          >
            <Tooltip title="处理告警">
              <AuditOutlined />
            </Tooltip>
          </a>
        ),
      ],
    },
  ];

  const params = useParams<{ id: string }>();
  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={(param) => service.record(param)}
        pagination={{
          pageSize: 10,
        }}
        defaultParams={{
          [`${type}Id`]: params.id,
        }}
        search={false}
      />
      <Modal
        maskClosable={false}
        title="处理告警"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={async () => {
          if (handleText === '') {
            onlyMessage('请填写处理结果', 'error');
          } else {
            const resp = await service.solve(id, handleText);
            if (resp.status === 200) {
              setVisible(false);
              setText('');
              actionRef.current?.reload();
            }
          }
        }}
      >
        <Input.TextArea rows={5} value={handleText} onChange={(e) => setText(e.target.value)} />
      </Modal>
    </>
  );
};
export default Record;
