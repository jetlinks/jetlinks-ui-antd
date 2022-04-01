import React, { useState } from 'react';
import classNames from 'classnames';

/**
 * 状态色
 */
export enum StatusColorEnum {
  'success' = 'success',
  'error' = 'error',
  'processing' = 'processing',
  'warning' = 'warning',
  'default' = 'default',
}

export type StatusColorType = keyof typeof StatusColorEnum;

export interface TableCardProps {
  status?: string | number;
  statusNames?: Record<string | number, StatusColorType>;
  children?: React.ReactNode;
}

export default (props: TableCardProps) => {
  const [maskShow, setMaskShow] = useState(false);

  const maskClassName = classNames('card-mask', { show: maskShow });

  const handleStatusColor = (): StatusColorType | undefined => {
    if ('statusNames' in props && props.status) {
      return props.statusNames![props.status];
    }
    return StatusColorEnum['default'];
  };

  return (
    <div className={'iot-card'}>
      <div className={'card-warp'}>
        <div
          className={'card-content'}
          onMouseEnter={() => {
            setMaskShow(true);
          }}
          onMouseLeave={() => {
            setMaskShow(false);
          }}
        >
          {props.children}
          <div className={classNames('card-state', handleStatusColor())}>
            <div className={'card-state-content'}></div>
          </div>
        </div>
        <div className={maskClassName}></div>
      </div>
      <div className={'card-tools'}></div>
    </div>
  );
};
