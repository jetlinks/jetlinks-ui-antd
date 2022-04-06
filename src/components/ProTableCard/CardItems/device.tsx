import React from 'react';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';

export interface DeviceCardProps extends DeviceInstance {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

const defaultImage = require('/public/images/device-type-3-big.png');

export default (props: DeviceCardProps) => {
  return (
    <TableCard
      detail={props.detail}
      actions={props.actions}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        online: StatusColorEnum.processing,
        offline: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={props.photoUrl || defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>设备类型</label>
              <div className={'ellipsis'}>{props.deviceType ? props.deviceType.text : '--'}</div>
            </div>
            <div>
              <label>产品名称</label>
              <div className={'ellipsis'}>{props.productName || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
