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
        id: 'pages.device.command.type',
        defaultMessage: '指令类型',
      }),
      dataIndex: 'messageType',
      filters: [
        {
          text: intl.formatMessage({
            id: 'pages.device.command.type.readProperty',
            defaultMessage: '读取属性',
          }),
          value: 'READ_PROPERTY',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.command.type.writeProperty',
            defaultMessage: '设置属性',
          }),
          value: 'WRITE_PROPERTY',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.command.type.invokeFunction',
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
            id: 'pages.device.command.status.wait',
            defaultMessage: '等待中',
          }),
          value: 'wait',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.command.status.sendError',
            defaultMessage: '发送失败',
          }),
          value: 'sendError',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.command.status.success',
            defaultMessage: '发送成功',
          }),
          value: 'success',
        },
      ],
      render: (value: any) => value.text,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.command.lastError',
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
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.device.command.option.send',
                  defaultMessage: '重新发送',
                })}
              >
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
        title={intl.formatMessage({
          id: 'pages.device.command',
          defaultMessage: '指令下发',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Command;
