import React from 'react';
import type { DeviceItem } from '@/pages/media/Device/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';

export interface ProductCardProps extends DeviceItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  showMask?: boolean;
}

const defaultImage = require('/public/images/device-media.png');

export default (props: ProductCardProps) => {
  return (
    <TableCard
      showMask={props.showMask}
      detail={props.detail}
      actions={props.actions}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        offline: StatusColorEnum.error,
        online: StatusColorEnum.processing,
        notActive: StatusColorEnum.processing,
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
              <label>厂商</label>
              <div className={'ellipsis'}>{props.manufacturer || '--'}</div>
            </div>
            <div>
              <label>通道数量</label>
              <div className={'ellipsis'}>{props.channelNumber || '--'}</div>
            </div>
            <div>
              <label>型号</label>
              <div className={'ellipsis'}>{props.model || '--'}</div>
            </div>
            <div>
              <label>接入方式</label>
              <div className={'ellipsis'}>{props.provider || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
