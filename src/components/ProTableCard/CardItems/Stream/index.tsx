import React from 'react';
import { TableCard } from '@/components';
import '@/style/common.less';
import './index.less';
import { Tooltip } from 'antd';

export interface StreamCardProps extends StreamItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

const defaultImage = require('/public/images/stream.png');

export default (props: StreamCardProps) => {
  return (
    <TableCard
      detail={props.detail}
      actions={props.actions}
      showStatus={false}
      showMask={false}
      className={'stream-card-item'}
    >
      <div className="context-stream">
        <div>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className="card">
          <div className="header">
            <div className="stream-title ellipsis">
              <Tooltip title={props.name}>{props.name}</Tooltip>
            </div>
          </div>
          <div className="container">
            <div>
              <label>服务商</label>
              <div className={'ellipsis'}>
                <Tooltip title={props?.provider}>{props?.provider}</Tooltip>
              </div>
            </div>
            <div>
              <label>RTP IP</label>
              <div className={'ellipsis'}>
                <Tooltip title={props?.configuration?.rtpIp}>{props?.configuration?.rtpIp}</Tooltip>
              </div>
            </div>
            <div>
              <label>API HOST</label>
              <div className={'ellipsis'}>
                <Tooltip title={props?.configuration?.apiHost}>
                  {props?.configuration?.apiHost}
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
