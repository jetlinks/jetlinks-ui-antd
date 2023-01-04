import React from 'react';
import type { CascadeItem } from '@/pages/media/Cascade/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Ellipsis, TableCard } from '@/components';
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
        enabled: StatusColorEnum.success,
        disabled: StatusColorEnum.error,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            {/*<span className={'card-item-header-name ellipsis'}>{props.name}</span>*/}
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div>通道数量： {props?.count || 0}</div>
          <div style={{ display: 'flex', width: '100%' }}>
            <Badge
              style={{ marginRight: 5 }}
              status={props.onlineStatus?.value === 'offline' ? 'error' : 'success'}
            />
            {/*<div*/}
            {/*  style={{*/}
            {/*    width: '90%',*/}
            {/*    overflow: 'hidden',*/}
            {/*    whiteSpace: 'nowrap',*/}
            {/*    textOverflow: 'ellipsis',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  sip:{props.sipConfigs[0]?.sipId}@{props.sipConfigs[0]?.hostAndPort}*/}
            {/*</div>*/}
            <Ellipsis
              title={`sip:${props.sipConfigs[0]?.sipId}@${props.sipConfigs[0]?.hostAndPort}`}
              maxWidth={'90%'}
            />
          </div>
        </div>
      </div>
    </TableCard>
  );
};
