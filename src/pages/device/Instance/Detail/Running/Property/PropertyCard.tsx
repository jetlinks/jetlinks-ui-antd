import {
  ClockCircleOutlined,
  EditOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Card, message, Space, Spin, Tooltip } from 'antd';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import { useState } from 'react';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import PropertyLog from '@/pages/device/Instance/Detail/MetadataLog/Property';
import EditProperty from '@/pages/device/Instance/Detail/Running/Property/EditProperty';
import moment from 'moment';
import Indicators from './Indicators';
import './PropertyCard.less';
import FileComponent from './FileComponent';

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
  const [indicatorVisible, setIndicatorVisible] = useState<boolean>(false);

  const renderTitle = (title: string) => {
    return (
      <div className="card-title-box">
        <div className="card-title">
          <Tooltip title={title}>{title}</Tooltip>
        </div>
        <Space style={{ fontSize: 12 }}>
          {(data.expands?.readOnly === false || data.expands?.readOnly === 'false') && (
            <Tooltip placement="top" title="设置属性至设备">
              <EditOutlined
                onClick={() => {
                  setEditVisible(true);
                }}
              />
            </Tooltip>
          )}
          {(data.expands?.metrics || []).length > 0 &&
            ['int', 'long', 'float', 'double', 'string', 'boolean', 'date'].includes(
              data.valueType?.type || '',
            ) && (
              <Tooltip placement="top" title="指标">
                <ClockCircleOutlined
                  onClick={() => {
                    setIndicatorVisible(true);
                  }}
                />
              </Tooltip>
            )}
          <Tooltip placement="top" title="获取最新属性值">
            <SyncOutlined onClick={refreshProperty} />
          </Tooltip>
          <Tooltip placement="top" title="详情">
            <UnorderedListOutlined
              onClick={() => {
                setVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      </div>
    );
  };

  return (
    <Card bordered hoverable style={{ backgroundColor: 'rgba(0, 0, 0, .02)' }}>
      <Spin spinning={loading}>
        <div>
          <div>{renderTitle(data?.name || '')}</div>
          <FileComponent type="card" value={value} data={data} />
          <div style={{ marginTop: 10 }}>
            <div style={{ color: 'rgba(0, 0, 0, .65)', fontSize: 12 }}>更新时间</div>
            <div style={{ marginTop: 5, fontSize: 16, color: 'black' }} className="value">
              {value?.timestamp ? moment(value?.timestamp).format('YYYY-MM-DD HH:mm:ss') : '--'}
            </div>
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
      {visible && <PropertyLog data={data} close={() => setVisible(false)} />}
      {indicatorVisible && (
        <Indicators
          data={data}
          onCancel={() => {
            setIndicatorVisible(false);
          }}
        />
      )}
    </Card>
  );
};
export default Property;
