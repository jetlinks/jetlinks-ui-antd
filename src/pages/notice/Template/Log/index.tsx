import { Modal } from 'antd';
import { observer } from '@formily/react';
import { service, state } from '..';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import { useLocation } from 'umi';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';

const Log = observer(() => {
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;

  const columns: ProColumns<LogItem>[] = [
    {
      dataIndex: 'config',
      title: 'config',
    },
    {
      dataIndex: 'sendTime',
      title: '发送时间',
    },
    {
      dataIndex: 'state',
      title: '状态',
    },
    {
      dataIndex: 'action',
      title: '操作',
      render: (text, record) => [
        <a
          key="info"
          onClick={() => {
            Modal.info({
              title: '详情信息',
              width: '30vw',
              content: (
                <div style={{ height: '300px', overflowY: 'auto' }}>{record.errorStack}</div>
              ),
              onOk() {},
            });
          }}
        >
          <InfoCircleOutlined />
        </a>,
      ],
    },
  ];
  const [param, setParam] = useState<any>();
  const actionRef = useRef<ActionType>();
  return (
    <Modal onCancel={() => (state.log = false)} title="通知记录" width={'70vw'} visible={state.log}>
      <SearchComponent
        defaultParam={[{ column: 'type$IN', value: id }]}
        field={columns}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
        enableSave={false}
      />
      <ProTable<LogItem>
        search={false}
        pagination={{
          pageSize: 5,
        }}
        params={param}
        columns={columns}
        request={async (params) => service.getHistoryLog(state.current?.id || '', params)}
      />
    </Modal>
  );
});
export default Log;
