import React, { memo, useState, useEffect } from 'react';
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';
import { Tooltip, Spin } from 'antd';
import AutoHide from '@/pages/device/location/info/autoHide';

interface Props {
  item: any;
}
const PropertiesCard: React.FC<Props> = props => {

  const { item } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<any>({});

  useEffect(() => {
    setData(item);
  }, []);

  const renderTitle = (name: string | undefined) => {
    return (
      <div style={{width: '80%',overflow: 'hidden', whiteSpace: 'nowrap',textOverflow: 'ellipsis'}}>
        <Tooltip placement="top" title={name}>
          {name}
        </Tooltip>
      </div>
    )
  }

  return (
    <>
      <Spin spinning={loading}>
        <ChartCard
          title={renderTitle(item.name)}
          contentHeight={46}
          hoverable
          total={
            <AutoHide
              title={
                typeof data.value?.formatValue === 'object'
                  ? JSON.stringify(data.value?.formatValue)
                  : data.value?.formatValue || '/'
              }
              style={{ width: '100%' }}
            />
          }
        >
          <span></span>
        </ChartCard>
      </Spin>
    </>
  );
};
export default memo(PropertiesCard);
