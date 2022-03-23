import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/device/Instance';
import { Drawer } from 'antd';
import { useParams } from 'umi';
import type { EventMetadata } from '@/pages/device/Product/typings';
import columns from '@/pages/device/Instance/Detail/MetadataLog/columns';

interface Props {
  visible: boolean;
  close: () => void;
  data: Partial<EventMetadata>;
}

const EventLog = (props: Props) => {
  const params = useParams<{ id: string }>();
  const { data, visible, close } = props;

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
            dataIndex: `value`,
            ellipsis: true,
            render: (text) => JSON.stringify(text),
          },
        ];

  return (
    <Drawer
      maskClosable={false}
      title={data.name}
      visible={visible}
      onClose={() => close()}
      width="45vw"
    >
      <ProTable
        size="small"
        rowKey="id"
        toolBarRender={false}
        request={async (param) =>
          service.getEventCount(params.id, data.id!, {
            ...param,
          })
        }
        pagination={{
          pageSize: 15,
        }}
        columns={[...columns, ...createColumn()]}
      />
    </Drawer>
  );
};
export default EventLog;
