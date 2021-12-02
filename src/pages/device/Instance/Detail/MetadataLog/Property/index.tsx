import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import { Drawer } from 'antd';
import encodeQuery from '@/utils/encodeQuery';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import columns from '@/pages/device/Instance/Detail/MetadataLog/columns';

interface Props {
  visible: boolean;
  close: () => void;
  data: Partial<PropertyMetadata>;
}

const PropertyLog = (props: Props) => {
  const params = useParams<{ id: string }>();
  const { visible, close, data } = props;

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
        columns={[
          ...columns,
          {
            dataIndex: 'formatValue',
            title: '数据',
            copyable: true,
          },
        ]}
      />
    </Drawer>
  );
};
export default PropertyLog;
