import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard } from '@/components';
import '@/style/common.less';
import { Badge } from 'antd';
import type { AccessItem } from '@/pages/link/AccessConfig/typings';
import './index.less';

export interface AccessConfigCardProps extends AccessItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

const defaultImage = require('/public/images/device-access.png');

export default (props: AccessConfigCardProps) => {
  return (
    <TableCard
      showMask={false}
      actions={props.actions}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        enabled: StatusColorEnum.processing,
        disabled: StatusColorEnum.error,
      }}
      contentClassName={props.state.value === 'disabled' ? 'tableCardDisabled' : 'tableCardEnabled'}
    >
      <div className="context-access">
        <div>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className="card">
          <div className="header">
            <div className="title">{props.name || '--'}</div>
            <div className="desc">{props.description || '--'}</div>
          </div>
          <div className="container">
            <div className="server">
              <div className="subTitle">{props?.channelInfo?.name || '--'}</div>
              <div style={{ width: '100%' }}>
                {props.channelInfo?.addresses.map((i: any, index: number) => (
                  <p key={i.address + `_address${index}`}>
                    <Badge color={i.health === -1 ? 'red' : 'green'} text={i.address} />
                  </p>
                ))}
              </div>
            </div>
            <div className="procotol">
              <div className="subTitle">{props?.protocolDetail?.name || '--'}</div>
              <p>{props.protocolDetail?.description || '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
