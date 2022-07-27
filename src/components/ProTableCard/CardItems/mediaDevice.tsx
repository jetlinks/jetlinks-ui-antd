import React from 'react';
import type { DeviceItem } from '@/pages/media/Device/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Ellipsis, TableCard } from '@/components';
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
        notActive: StatusColorEnum.warning,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={props.photoUrl || defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            {/*<span className={'card-item-header-name ellipsis'}>{props.name}</span>*/}
            <Ellipsis title={props?.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>厂商</label>
              <Ellipsis title={props?.manufacturer} />
              {/*<div className={'ellipsis'}>{props.manufacturer || ''}</div>*/}
            </div>
            <div>
              <label>通道数量</label>
              <Ellipsis title={props?.channelNumber} />
              {/*<div className={'ellipsis'}>{props.channelNumber || 0}</div>*/}
            </div>
            <div>
              <label>型号</label>
              <Ellipsis title={props?.model} />
              {/*<div className={'ellipsis'}>{props.model || ''}</div>*/}
            </div>
            <div>
              <label>接入方式</label>
              <Ellipsis title={props?.provider} />
              {/*<div className={'ellipsis'}>{props.provider || ''}</div>*/}
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
