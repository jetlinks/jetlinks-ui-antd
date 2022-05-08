import React from 'react';
import type { MapProps } from 'react-amap';
import { Map } from 'react-amap';

interface AMapProps extends MapProps {
  style?: React.CSSProperties;
  className?: string;
}

export default (props: AMapProps) => {
  const { style, className, ...extraProps } = props;

  // TODO 后期可以使用页面渲染时获取缓存中的key

  return (
    <div style={style || { width: '100%', height: '100%' }} className={className}>
      {
        // @ts-ignore
        <Map version={'1.4.0'} {...extraProps}>
          {props.children}
        </Map>
      }
    </div>
  );
};
