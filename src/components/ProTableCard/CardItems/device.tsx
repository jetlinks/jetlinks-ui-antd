import React from 'react';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import '../index.less';
import { TableCard } from '@/components';

export interface DeviceCardProps extends DeviceInstance {
  actions?: React.ReactNode[];
  avatarSize?: number;
}

const defaultImage = require('/public/images/device-type-3-big.png');

export default (props: DeviceCardProps) => {
  return (
    <TableCard
      actions={props.actions}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        online: StatusColorEnum.success,
        offline: StatusColorEnum.error,
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
            <label>设备类型：</label> <br />
            <span className={'ellipsis'}>{props.deviceType ? props.deviceType.text : '--'}</span>
          </div>
          <div className={'card-item-content'}>
            <label>产品名称：</label> <br />
            <span className={'ellipsis'}>{props.productName || '--'}</span>
          </div>
        </div>
      </div>
    </TableCard>
    // <Card style={{ width: '100%' }} cover={null} actions={props.actions}>
    //   <div className={'pro-table-card-item'}>
    //     <div className={'card-item-avatar'}>
    //       <Avatar size={props.avatarSize || 64} src={props.photoUrl} />
    //     </div>
    //     <div className={'card-item-body'}>
    //       <div className={'card-item-header'}>
    //         <span className={'card-item-header-name ellipsis'}>{props.name}</span>
    //         <BadgeStatus
    //           status={props.state.value}
    //           text={props.state.text}
    //           statusNames={{
    //             online: StatusColorEnum.success,
    //             offline: StatusColorEnum.error,
    //             notActive: StatusColorEnum.processing,
    //           }}
    //         />
    //       </div>
    //       <div className={'card-item-content'}>
    //         <label>设备类型：</label>
    //         <span className={'ellipsis'}>{props.deviceType ? props.deviceType.text : '--'}</span>
    //       </div>
    //       <div className={'card-item-content'}>
    //         <label>产品名称：</label>
    //         <span className={'ellipsis'}>{props.productName || '--'}</span>
    //       </div>
    //     </div>
    //   </div>
    // </Card>
  );
};
