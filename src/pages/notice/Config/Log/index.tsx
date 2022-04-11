import { Modal } from 'antd';
import { observer } from '@formily/react';
import { service, state } from '..';
import ProTable, { ProColumns } from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import { useLocation } from 'umi';
import { InfoCircleOutlined } from '@ant-design/icons';

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
    },
    {
      dataIndex: 'action',
      title: '操作',
      render: (text, record) => [
        <a
          onClick={() => {
            Modal.info({
              title: '详情信息',
              content: (
                <div>
                  <p>some messages...some messages...</p>
                  <p>some messages...some messages...</p>
                  {JSON.stringify(record)}
                </div>
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
  return (
    <Modal onCancel={() => (state.log = false)} title="通知记录" width={'70vw'} visible={state.log}>
      <SearchComponent
        defaultParam={[{ column: 'type$IN', value: id }]}
        field={columns}
        onSearch={(data) => {
          // actionRef.current?.reset?.();
          // setParam(data);
          console.log(data);
        }}
        enableSave={false}
      />
      <ProTable<LogItem>
        search={false}
        pagination={{
          pageSize: 5,
        }}
        columns={columns}
        request={async (params) => service.query(params)}
      ></ProTable>
    </Modal>
  );
});

export default Log;
