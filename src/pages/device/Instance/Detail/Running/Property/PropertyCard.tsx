import {
  ClockCircleOutlined,
  EditOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Card, Space, Spin, Tooltip } from 'antd';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import PropertyLog from '@/pages/device/Instance/Detail/MetadataLog/Property';
import EditProperty from '@/pages/device/Instance/Detail/Running/Property/EditProperty';
import moment from 'moment';
import Indicators from './Indicators';
import './PropertyCard.less';
import FileComponent from './FileComponent';
import { onlyMessage } from '@/utils/util';

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
      onlyMessage('操作成功');
    }
  };

  const [visible, setVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [indicatorVisible, setIndicatorVisible] = useState<boolean>(false);
  const [dataValue, setDataValue] = useState<any>(value);

  const renderTitle = (title: string) => {
    return (
      <div className="card-title-box">
        <div className="card-title">
          <Tooltip title={title} placement="topLeft">
            {title}
          </Tooltip>
        </div>
        <Space style={{ fontSize: 12 }}>
          {data.expands?.type?.includes('write') && (
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
          {data.expands?.type?.includes('read') && (
            <Tooltip placement="top" title="获取最新属性值">
              <SyncOutlined onClick={refreshProperty} />
            </Tooltip>
          )}
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

  useEffect(() => {
    if (!dataValue?.timestamp) {
      setDataValue(value);
    } else if (dataValue?.timestamp && dataValue?.timestamp <= value?.timestamp) {
      setDataValue(value);
    }
  }, [value]);

  return (
    <Card bordered hoverable style={{ backgroundColor: 'rgba(0, 0, 0, .02)' }}>
      <Spin spinning={loading}>
        <div>
          <div>{renderTitle(data?.name || '')}</div>
          <FileComponent type="card" value={dataValue} data={data} />
          <div style={{ marginTop: 10 }}>
            <div style={{ color: 'rgba(0, 0, 0, .65)', fontSize: 12 }}>更新时间</div>
            <Tooltip
              title={
                dataValue?.timestamp
                  ? moment(dataValue?.timestamp).format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }
            >
              <div
                style={{ marginTop: 5, fontSize: 16, color: 'black', minHeight: 25 }}
                className="time-value"
              >
                {dataValue?.timestamp
                  ? moment(dataValue?.timestamp).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </div>
            </Tooltip>
          </div>
        </div>
      </Spin>
      {editVisible && (
        <EditProperty
          onCancel={() => {
            setEditVisible(false);
          }}
          data={data}
        />
      )}
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
