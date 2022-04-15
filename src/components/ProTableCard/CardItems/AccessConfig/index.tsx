import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard } from '@/components';
import '@/style/common.less';
import { Badge, Tooltip } from 'antd';
import type { AccessItem } from '@/pages/link/AccessConfig/typings';
import './index.less';
import classNames from 'classnames';

export interface AccessConfigCardProps extends AccessItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
  showTool?: boolean;
  activeStyle?: string;
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
      showTool={props.showTool}
      contentClassName={props.state.value === 'disabled' ? 'tableCardDisabled' : 'tableCardEnabled'}
      className={classNames('access-config-card-item', props.activeStyle)}
    >
      <div className="context-access">
        <div>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className="card">
          <div className="header">
            <Tooltip title={props.name}>
              <div className="title ellipsis">{props.name || '--'}</div>
            </Tooltip>
            <div className="desc">{props.description || '--'}</div>
          </div>
          <div className="container">
            <div className="server">
              <div className="subTitle">{props?.channelInfo?.name || '--'}</div>
              {props.channelInfo?.addresses.slice(0, 2).map((i: any, index: number) => (
                <div className="subItem" key={i.address + `_address${index}`}>
                  <Badge color={i.health === -1 ? 'red' : 'green'} text={i.address} />
                </div>
              ))}
            </div>
            <div className="procotol">
              <div className="subTitle">{props?.protocolDetail?.name || '--'}</div>
              <div className="desc">{props.protocolDetail?.description || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
