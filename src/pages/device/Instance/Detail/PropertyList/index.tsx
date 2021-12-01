import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import { Drawer } from 'antd';
import encodeQuery from '@/utils/encodeQuery';
import moment from 'moment';
import type { PropertyMetadata } from '@/pages/device/Product/typings';

type PropertyData = {
  data: string;
  date: string;
};

interface Props {
  property: string;
  visible: boolean;
  close: () => void;
  data: Partial<PropertyMetadata>;
}

const PropertyList = (props: Props) => {
  const params = useParams<{ id: string }>();
  const { property, visible, close, data } = props;
  const columns: ProColumns<PropertyData>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'timestamp',
      title: '时间',
      sorter: true,
      width: 200,
      renderText: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'formatValue',
      title: '数据',
      copyable: true,
    },
  ];
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
              terms: { property: property },
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
export default PropertyList;
