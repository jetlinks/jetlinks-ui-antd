import { EditOutlined, SyncOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Divider, message, Spin, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import { useState } from 'react';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import PropertyLog from '@/pages/device/Instance/Detail/MetadataLog/Property';
import EditProperty from '@/pages/device/Instance/Detail/Running/Property/EditProperty';
import moment from 'moment';

interface Props {
  data: Partial<PropertyMetadata>;
  value: any;
}

const Property = (props: Props) => {
  const { data, value } = props;

  const params = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(false);
  const refreshProperty = async () => {
    setLoading(true);
    if (!data.id) return;
    const resp = await service.getProperty(params.id, data.id);
    setLoading(false);
    if (resp.status === 200) {
      message.success('操作成功');
    }
  };

  const [visible, setVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);

  return (
    <ProCard
      title={`${data?.name}`}
      extra={
        <>
          {(data.expands?.readOnly === false || data.expands?.readOnly === 'false') && (
            <>
              <Tooltip placement="top" title="设置属性至设备">
                <EditOutlined
                  onClick={() => {
                    setEditVisible(true);
                  }}
                />
              </Tooltip>
              <Divider type="vertical" />
            </>
          )}
          <Tooltip placement="top" title="获取最新属性值">
            <SyncOutlined onClick={refreshProperty} />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="top" title="详情">
            <UnorderedListOutlined
              onClick={() => {
                setVisible(true);
              }}
            />
          </Tooltip>
        </>
      }
      bordered
      hoverable
      colSpan={{ xs: 12, sm: 8, md: 6, lg: 6, xl: 6 }}
    >
      <Spin spinning={loading}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '30px' }}>{value?.formatValue || '--'}</div>
          <div style={{ marginTop: 10 }}>
            {value?.timestamp ? moment(value?.timestamp).format('YYYY-MM-DD HH:mm:ss') : '--'}
          </div>
        </div>
      </Spin>
      <EditProperty
        visible={editVisible}
        onCancel={() => {
          setEditVisible(false);
        }}
        data={data}
      />
      <PropertyLog data={data} visible={visible} close={() => setVisible(false)} />
    </ProCard>
  );
};
export default Property;
