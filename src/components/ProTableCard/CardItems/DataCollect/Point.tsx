import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard, Ellipsis } from '@/components';
import '@/style/common.less';
import './index.less';

export interface PointCardProps extends Partial<PointItem> {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
  className?: string;
  content?: React.ReactNode[];
  onClick?: () => void;
  grantedPermissions?: string[];
  onUnBind?: (e: any) => void;
  showBindBtn?: boolean;
  cardType?: 'bind' | 'unbind';
  showTool?: boolean;
}

const defaultImage = require('/public/images/device-type-3-big.png');

export default (props: PointCardProps) => {
  return (
    <TableCard
      showMask={false}
      actions={props.actions}
      status={props.state?.value}
      statusText={props.state?.text}
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
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            {/*<div>*/}
            {/*  <label>设备类型</label>*/}
            {/*  <Ellipsis title={props.deviceType ? props.deviceType.text : ''} />*/}
            {/*  /!*<div className={'ellipsis'}>{props.deviceType ? props.deviceType.text : ''}</div>*!/*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <label>产品名称</label>*/}
            {/*  <Ellipsis title={props.productName} />*/}
            {/*  /!*<div className={'ellipsis'}>{props.productName || ''}</div>*!/*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </TableCard>
  );
};
