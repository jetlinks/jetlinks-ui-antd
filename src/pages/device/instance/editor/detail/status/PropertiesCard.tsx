import React, { memo, useState, useEffect } from 'react';
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';
import { Tooltip, Icon, message, Spin } from 'antd';
import AutoHide from '@/pages/device/location/info/autoHide';
import { MiniArea } from '@/pages/analysis/components/Charts';
import Service from '../../service';
import PropertiesInfo from '../properties-data/propertiesInfo';
import UpdateProperty from '@/pages/device/instance/editor/detail/updateProperty';

interface Props {
  item: {
    name?: string;
    expands?: {
      readOnly: string | boolean;
    };
    id: string;
    valueType: {
      type: string;
      unit: string;
    };
    list: {
      timeString: string;
      timestamp: number;
      formatValue: string;
      property: string;
      value: number;
    }[];
    formatValue?: string;
    value?: string | number;
    visitData: any[];
    subscribe: Function;
  };
  device: any;
}
const PropertiesCard: React.FC<Props> = props => {
  const service = new Service();

  const { item, device } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const getValue = () => {
    if (item?.list) {
      const length = item?.list.length;
      const value = item.list[length - 1];
      const dataType = typeof value.formatValue;
      if (dataType === 'object') {
        item.formatValue = JSON.stringify(value.formatValue) || '/';
      } else {
        item.formatValue = value.formatValue || '/';
        if (value.value === 0) {
          item.formatValue = "0";
        }
        item.value = value.value || 0;
      }

      // 特殊类型
      const valueType = item.valueType.type;
      if (
        valueType === 'int' ||
        valueType === 'float' ||
        valueType === 'double' ||
        valueType === 'long'
      ) {
        const visitData: any[] = [];
        item.list.forEach(data => {
          visitData.push({
            x: data.timeString,
            y: Math.floor(Number(data.value) * 100) / 100,
          });
        });
        item.visitData = visitData;
      }
    }
    return item;
  };

  const [data, setData] = useState(getValue);

  const [visible, setVisible] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    item.subscribe((resp: any) => {
      const value = resp.value.value;
      const type = typeof value;
      if (type === 'number') {
        if ((data.visitData || []).length > 14) {
          data.visitData.shift();
        }
        if (!data.visitData) {
          data.visitData = [];
        }
        data.visitData.push({ x: resp.timeString, y: resp.value.value });
      }
      setData({
        ...data,
        ...resp.value,
      });
      setLoading(false);
    });
  }, []);

  const refreshProperty = (item: any) => {
    setLoading(true);
    // 刷新数据
    service.getProperty(device.id, item.id).subscribe(
      () => {},
      () => {},
      () => {
        setLoading(false);
      },
    );
  };

  const updateProperty = (item: any) => {
    service.updateProperty(device.id, item).subscribe(() => {
      message.success('操作成功');
      setEdit(false);
    });
  };

  return (
    <>
      <Spin spinning={loading}>
        <ChartCard
          bordered={false}
          title={item.name}
          contentHeight={46}
          action={
            <div>
              {(item.expands?.readOnly === 'false' || item.expands?.readOnly === false) && (
                <Tooltip placement="top" title="设置属性至设备">
                  <Icon
                    title="编辑"
                    type="edit"
                    onClick={() => {
                      setEdit(true);
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip placement="top" title="从设备端获取属性值">
                <Icon
                  title="刷新"
                  style={{ marginLeft: '10px' }}
                  type="sync"
                  onClick={() => refreshProperty(item)}
                />
              </Tooltip>
              <Tooltip placement="top" title="详情">
                <Icon
                  title="详情"
                  style={{ marginLeft: '10px' }}
                  type="bars"
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              </Tooltip>
            </div>
          }
          total={
            <AutoHide
              title={
                typeof data.formatValue === 'object'
                  ? JSON.stringify(data.formatValue)
                  : data.formatValue
              }
              style={{ width: '100%' }}
            />
          }
        >
          <MiniArea height={40} color="#975FE4" data={data.visitData} />
        </ChartCard>
      </Spin>
      {visible && (
        <PropertiesInfo
          item={item}
          close={() => {
            setVisible(false);
          }}
          deviceId={props.device.id}
        />
      )}
      {edit && (
        <UpdateProperty
          data={item}
          save={(data: any) => {
            item.value = data[item.id];
            updateProperty(data);
          }}
          close={() => setEdit(false)}
        />
      )}
    </>
  );
};
export default memo(PropertiesCard);
