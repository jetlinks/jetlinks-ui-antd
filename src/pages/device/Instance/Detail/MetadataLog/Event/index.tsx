import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/device/Instance';
import encodeQuery from '@/utils/encodeQuery';
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

  return (
    <Drawer title={data.name} visible={visible} onClose={() => close()} width="45vw">
      <ProTable
        size="small"
        toolBarRender={false}
        request={async (param) =>
          service.getPropertyData(
            params.id,
            encodeQuery({
              ...param,
              terms: { property: data.id },
              sorts: { timestamp: 'desc' },
            }),
          )
        }
        pagination={{
          pageSize: 15,
        }}
        columns={columns}
      />
    </Drawer>
  );
};
export default EventLog;
