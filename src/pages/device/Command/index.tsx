import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { CommandItem } from '@/pages/device/Command/typings';
import { Divider } from 'antd';
import moment from 'moment';
import BaseCrud from '@/components/BaseCrud';

const service = new BaseService('device/message/task');
const Command = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<CommandItem>[] = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '指令类型',
      dataIndex: 'messageType',
      filters: [
        { text: '读取属性', value: 'READ_PROPERTY' },
        { text: '设置属性', value: 'WRITE_PROPERTY' },
        { text: '调用功能', value: 'INVOKE_FUNCTION' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'state',
      filters: [
        { text: '等待中', value: 'wait' },
        { text: '发送失败', value: 'sendError' },
        { text: '发送成功', value: 'success' },
      ],
      render: (value: any) => value.text,
    },
    {
      title: '错误信息',
      dataIndex: 'lastError',
    },
    {
      title: '发送时间',
      dataIndex: 'sendTimestamp',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a
            onClick={() => {
              // setVisible(true);
              // setCurrent(record);
            }}
          >
            查看指令
          </a>
          {record.state.value !== 'wait' && (
            <>
              <Divider type="vertical" />
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
                重新发送
              </a>
            </>
          )}
        </>
      ),
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
