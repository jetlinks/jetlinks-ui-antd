import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import type { EventMetadata } from '@/pages/device/Product/typings';
import SearchComponent from '@/components/SearchComponent';
import moment from 'moment';
import { Form, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface Props {
  data: Partial<EventMetadata>;
}

const EventLog = (props: Props) => {
  const params = useParams<{ id: string }>();
  const { data } = props;
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({ pageSize: 10 });
  // const device = InstanceModel.detail;
  // const [subscribeTopic] = useSendWebsocketMessage();

  const columns: ProColumns<MetadataLogData>[] = [
    {
      dataIndex: 'timestamp',
      title: '时间',
      sorter: true,
      renderText: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'option',
      title: '操作',
      render: (text, record) => [
        <a
          key={'option'}
          onClick={() => {
            for (const i in record) {
              if (i.indexOf('_format') != -1) {
                delete record[i];
              }
            }
            Modal.info({
              title: '详情',
              width: 850,
              content: (
                <Form.Item wrapperCol={{ span: 22 }} labelCol={{ span: 2 }} label={data.name}>
                  <MonacoEditor
                    height={350}
                    theme="vs"
                    language="json"
                    value={JSON.stringify(record, null, 2)}
                  />
                </Form.Item>
              ),
              okText: '关闭',
              onOk() {},
            });
          }}
        >
          <SearchOutlined />
        </a>,
      ],
    },
  ];

  /**
   * 订阅事件数据
   */
  // const subscribeEvent = () => {
  //   const id = `instance-info-event-${device.id}-${device.productId}`;
  //   const topic = `/dashboard/device/${device.productId}/events/realTime`;
  //   subscribeTopic!(id, topic, {
  //     deviceId: device.id,
  //   })
  //     ?.pipe(map((res) => res.payload))
  //     .subscribe((payload: any) => {
  //       const { value } = payload;
  //       if (value) {
  //         actionRef.current?.reload?.();
  //       }
  //     });
  // };

  // useEffect(() => {
  //   subscribeEvent();
  // }, []);

  const createColumn = (): ProColumns[] =>
    data.valueType?.type === 'object'
      ? data.valueType.properties.map(
          (i: any) =>
            ({
              key: i.id,
              title: i.name,
              dataIndex: i.id,
              renderText: (text) => (typeof text === 'object' ? JSON.stringify(text) : text),
            } as ProColumns),
        )
      : [
          {
            title: '数据',
            dataIndex: 'value',
            ellipsis: true,
            // render: (text) => text ? JSON.stringify(text) : ''
          },
        ];

  return (
    <div>
      <SearchComponent<any>
        field={[...createColumn(), ...columns]}
        target="events"
        enableSave={false}
        // pattern={'simple'}
        onSearch={(param) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setSearchParams(param);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setSearchParams({});
        // }}
      />
      <ProTable
        size="small"
        rowKey="id"
        actionRef={actionRef}
        search={false}
        params={searchParams}
        toolBarRender={false}
        request={async (param) => {
          param.pageIndex = param.current - 1;
          delete param.current;
          delete param.total;
          return service.getEventCount(params.id, data.id!, {
            ...param,
          });
        }}
        pagination={{
          pageSize: 10,
        }}
        columns={[...createColumn(), ...columns]}
      />
    </div>
  );
};
export default EventLog;
