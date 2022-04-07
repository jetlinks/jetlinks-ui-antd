import React from 'react';
import type { CascadeItem } from '@/pages/media/Cascade/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { Badge } from 'antd';

export interface CascadeCardProps extends CascadeItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

const defaultImage = require('/public/images/device-type-3-big.png');

export default (props: CascadeCardProps) => {
  return (
    <TableCard
      showMask={false}
      actions={props.actions}
      status={props.status.value}
      statusText={props.status.text}
      statusNames={{
        enabled: StatusColorEnum.processing,
        disabled: StatusColorEnum.error,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
          </div>
          <div>通道数量： 5</div>
          <div>
            <Badge
              status={props.onlineStatus?.value === 'offline' ? 'error' : 'success'}
              text={`sip:${props.sipConfigs[0]?.sipId}@${props.sipConfigs[0]?.hostAndPort}`}
            />
          </div>
        </div>
      </div>
    </TableCard>
  );
};
