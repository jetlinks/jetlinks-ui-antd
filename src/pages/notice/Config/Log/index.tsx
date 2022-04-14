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
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'sendTime',
      title: '发送时间',
    },
    {
      dataIndex: 'state',
      title: '状态',
      renderText: (text) => text.text,
    },
    {
      dataIndex: 'action',
      title: '操作',
      render: (text, record) => [
        <a
          onClick={() => {
            Modal.info({
              title: '详情信息',
              width: '30vw',
              content: (
                <div style={{ height: '300px', overflowY: 'auto' }}>{JSON.stringify(record)}</div>
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
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState<any>();
  return (
    <Modal
      footer={null}
      onCancel={() => (state.log = false)}
      title="通知记录"
      width={'70vw'}
      visible={state.log && !!state.current?.id}
    >
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
        params={param}
        search={false}
        pagination={{
          pageSize: 5,
        }}
        columns={columns}
        request={async (params) => service.getHistoryLog(state.current?.id || '', params)}
      />
    </Modal>
  );
});

export default Log;
