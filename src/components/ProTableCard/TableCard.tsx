import React, { useState } from 'react';
import classNames from 'classnames';
import { BadgeStatus } from '@/components';
import { StatusColorEnum, StatusColorType } from '@/components/BadgeStatus';
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
}

function getAction(actions: React.ReactNode[]) {
  return actions.map((item: any) => {
    return (
      <div className={classNames('card-button', { delete: item.key === 'delete' })}>{item}</div>
    );
  });
}

export default (props: TableCardProps) => {
  const [maskShow, setMaskShow] = useState(false);

  const handleStatusColor = (): StatusColorType | undefined => {
    if ('statusNames' in props && props.status) {
      return props.statusNames![props.status];
    }
    return StatusColorEnum.default;
  };

  const statusNode =
    props.showStatus === false ? null : (
      <div className={classNames('card-state', handleStatusColor())}>
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
          className={'card-content'}
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
