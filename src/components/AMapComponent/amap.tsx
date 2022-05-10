import React, { useState } from 'react';
import type { MapProps } from 'react-amap';
import { Map } from 'react-amap';
import { getAMapUiPromise } from './APILoader';

interface AMapProps extends MapProps {
  style?: React.CSSProperties;
  className?: string;
  AMapUI?: string;
}

export default (props: AMapProps) => {
  const { style, className, onInstanceCreated, ...extraProps } = props;

  const [uiLoading, setUiLoading] = useState(false);

  const isOpenUi = 'AMapUI' in props || props.AMapUI;

  const getAMapUI = () => {
    const version = typeof props.AMapUI === 'string' ? props.AMapUI : '1.1';
    getAMapUiPromise(version).then(() => {
      setUiLoading(true);
    });
  };

  // TODO 后期可以使用页面渲染时获取缓存中的key

  return (
    <div style={style || { width: '100%', height: '100%' }} className={className}>
      {
        // @ts-ignore
        <Map
          version={'2.0'}
          onInstanceCreated={(map: any) => {
            if (onInstanceCreated) {
              onInstanceCreated(map);
            }
            console.log(isOpenUi);
            if (isOpenUi) {
              getAMapUI();
            }
          }}
          {...extraProps}
        >
          {isOpenUi ? (uiLoading ? props.children : null) : props.children}
        </Map>
      }
    </div>
  );
};
