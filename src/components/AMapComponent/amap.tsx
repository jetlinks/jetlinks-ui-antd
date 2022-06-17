import React, { useState } from 'react';
import type { MapProps } from 'react-amap';
import { Map } from 'react-amap';
import { getAMapUiPromise } from './APILoader';
import SystemConst from '@/utils/const';
import { Empty } from 'antd';

interface AMapProps extends Omit<MapProps, 'amapkey' | 'useAMapUI'> {
  style?: React.CSSProperties;
  className?: string;
  AMapUI?: string | boolean;
}

export default (props: AMapProps) => {
  const { style, className, events, onInstanceCreated, children, ...extraProps } = props;

  const [uiLoading, setUiLoading] = useState(false);

  const isOpenUi = 'AMapUI' in props || props.AMapUI;

  const amapKey = localStorage.getItem(SystemConst.AMAP_KEY);

  const getAMapUI = () => {
    const version = typeof props.AMapUI === 'string' ? props.AMapUI : '1.1';
    getAMapUiPromise(version).then(() => {
      setUiLoading(true);
    });
  };

  const onCreated = (map: any) => {
    if (onInstanceCreated) {
      onInstanceCreated(map);
    }
    if (isOpenUi) {
      getAMapUI();
    }
  };

  console.log(isOpenUi, uiLoading);

  return (
    <div style={style || { width: '100%', height: '100%' }} className={className}>
      {amapKey ? (
        // @ts-ignore
        <Map
          amapkey={amapKey}
          zooms={[3, 20]}
          events={
            events
              ? {
                  ...events!,
                  created: onCreated,
                }
              : {
                  created: onCreated,
                }
          }
          {...extraProps}
        >
          {isOpenUi ? (uiLoading ? children : null) : children}
        </Map>
      ) : (
        <Empty description={'请配置高德地图key'} />
      )}
    </div>
  );
};
