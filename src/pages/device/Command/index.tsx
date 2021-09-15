import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import { useRef } from 'react';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import type { CommandItem } from '@/pages/device/Command/typings';
import { Tooltip } from 'antd';
import moment from 'moment';
import BaseCrud from '@/components/BaseCrud';
import { EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';

const service = new BaseService('device/message/task');
const Command = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<CommandItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.device.command.deviceID',
        defaultMessage: '设备ID',
      }),
      dataIndex: 'deviceId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.indexBorder.equipmentName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'deviceName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.command.instructionType',
        defaultMessage: '指令类型',
      }),
      dataIndex: 'messageType',
      filters: [
        {
          text: intl.formatMessage({
            id: 'pages.device.command.instructionType.readAttributes',
            defaultMessage: '读取属性',
          }),
          value: 'READ_PROPERTY',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.command.instructionType.setProperties',
            defaultMessage: '设置属性',
          }),
          value: 'WRITE_PROPERTY',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.command.instructionType.callAttribute',
            defaultMessage: '调用属性',
          }),
          value: 'INVOKE_FUNCTION',
        },
      ],
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      filters: [
        {
          text: intl.formatMessage({
            id: 'pages.device.command.status.waiting',
            defaultMessage: '等待中',
          }),
          value: 'wait',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.command.status.failed ',
            defaultMessage: '发送失败',
          }),
          value: 'sendError',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.command.status.succeed',
            defaultMessage: '发送成功',
          }),
          value: 'success',
        },
      ],
      render: (value: any) => value.text,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.command.errorMessage',
        defaultMessage: '错误信息',
      }),
      dataIndex: 'lastError',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.command.sendTime',
        defaultMessage: '发送时间',
      }),
      dataIndex: 'sendTimestamp',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
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
        <a
          onClick={() => {
            // setVisible(true);
            // setCurrent(record);
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
        <a>
          {record.state.value !== 'wait' && (
            <a
              onClick={() => {
                // service.resend(encodeQueryParam({ terms: { id: record.id } })).subscribe(
                //   data => {
                //     message.success('操作成功');
                //   },
                //   () => {},
                //   () => handleSearch(searchParam),
                // );
              }}
            >
              <Tooltip title="重新发送">
                <SyncOutlined />
              </Tooltip>
            </a>
          )}
        </a>,
      ],
    },
  ];

  const schema = {};
  return (
    <PageContainer>
      <BaseCrud<CommandItem>
        columns={columns}
        service={service}
        title={'指令下发'}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Command;
