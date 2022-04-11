import React, { useState } from 'react';
import classNames from 'classnames';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import type { StatusColorType } from '@/components/BadgeStatus';
import './index.less';

export interface TableCardProps {
  className?: string;
  showStatus?: boolean;
  showTool?: boolean;
  showMask?: boolean;
  detail?: React.ReactNode;
  status?: string | number;
  statusText?: React.ReactNode;
  statusNames?: Record<string | number, StatusColorType>;
  children?: React.ReactNode;
  actions?: React.ReactNode[];
  contentClassName?: string;
}

function getAction(actions: React.ReactNode[]) {
  return actions.map((item: any) => {
    return (
      <div
        className={classNames('card-button', {
          delete: item.key === 'delete',
          disabled: item.disabled,
        })}
        key={item.key}
      >
        {item}
      </div>
    );
  });
}

export default (props: TableCardProps) => {
  const [maskShow, setMaskShow] = useState(false);

  const handleStatusColor = (data: TableCardProps): StatusColorType | undefined => {
    if ('statusNames' in data && data.status !== undefined) {
      return data.statusNames![data.status];
    }
    return StatusColorEnum.default;
  };

  const statusNode =
    props.showStatus === false ? null : (
      <div className={classNames('card-state', handleStatusColor(props))}>
        <div className={'card-state-content'}>
          <BadgeStatus
            status={props.status !== undefined ? props.status : ''}
            text={props.statusText}
            statusNames={props.statusNames}
          />
        </div>
      </div>
    );

  const maskClassName = classNames('card-mask', { show: maskShow });

  const maskNode =
    props.showMask === false ? null : <div className={maskClassName}>{props.detail}</div>;

  const toolNode =
    props.showTool === false ? null : (
      <div className={'card-tools'}>
        {props.actions && props.actions.length ? getAction(props.actions) : null}
      </div>
    );

  return (
    <div className={classNames('iot-card', { hover: maskShow }, props.className)}>
      <div className={'card-warp'}>
        <div
          className={classNames('card-content', props.contentClassName)}
          onMouseEnter={() => {
            setMaskShow(true);
          }}
          onMouseLeave={() => {
            setMaskShow(false);
          }}
        >
          {props.children}
          {statusNode}
          {maskNode}
        </div>
      </div>
      {toolNode}
    </div>
  );
};
