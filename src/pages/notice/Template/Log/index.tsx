import { Badge, Modal } from 'antd';
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
      title: 'id',
      width: 200,
    },
    {
      dataIndex: 'notifyTime',
      title: '发送时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'state',
      title: '状态',
      valueType: 'select',
      valueEnum: {
        success: {
          text: '成功',
          status: 'success',
        },
        error: {
          text: '失败',
          status: 'error',
        },
      },
      renderText: (text: { value: string; text: string }, record) => {
        return (
          <>
            <Badge status={text.value === 'success' ? 'success' : 'error'} text={text.text} />
            {text.value !== 'success' && (
              <a
                style={{ marginLeft: 5 }}
                key="info"
                onClick={() => {
                  Modal.info({
                    title: '错误信息',
                    width: '30vw',
                    content: (
                      <div style={{ height: '300px', overflowY: 'auto' }}>{record.errorStack}</div>
                    ),
                    onOk() {},
                  });
                }}
              >
                <InfoCircleOutlined />
              </a>
            )}
          </>
        );
      },
    },
    {
      dataIndex: 'action',
      title: '操作',
      hideInSearch: true,
      render: (text, record) => [
        <a
          key="info"
          onClick={() => {
            Modal.info({
              title: '详情信息',
              width: '30vw',
              content: (
                <div style={{ height: '300px', overflowY: 'auto' }}>
                  {JSON.stringify(record.context)}
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
  const [param, setParam] = useState<any>();
  const actionRef = useRef<ActionType>();
  return (
    <Modal
      forceRender
      footer={null}
      destroyOnClose
      onCancel={() => (state.log = false)}
      title="通知记录"
      width={'65vw'}
      visible={state.log && !!state.current?.id}
    >
      <SearchComponent
        defaultParam={[{ column: 'notifyType$IN', value: id }]}
        field={columns}
        model="simple"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
        enableSave={false}
      />
      <ProTable<LogItem>
        search={false}
        pagination={
          {
            // pageSize: 5,
          }
        }
        params={param}
        columns={columns}
        request={async (params) =>
          service.getHistoryLog(state.current?.id || '', {
            ...params,
            sorts: [{ name: 'notifyTime', order: 'desc' }],
          })
        }
      />
    </Modal>
  );
});
export default Log;
