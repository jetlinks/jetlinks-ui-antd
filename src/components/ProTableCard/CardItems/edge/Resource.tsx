import { Ellipsis, TableCard } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import '@/style/common.less';
import '../../index.less';
import React from 'react';

export interface ResourceCardProps extends Partial<ResourceItem> {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
  className?: string;
  content?: React.ReactNode[];
  onClick?: () => void;
  showTool?: boolean;
}

const defaultImage = require('/public/images/device-type-3-big.png');

export default (props: ResourceCardProps) => {
  return (
    <TableCard
      showMask={false}
      detail={props.detail}
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
            <div>
              <label>通讯协议</label>
              <Ellipsis title={props?.category || ''} />
            </div>
            <div>
              <label>所属边缘网关</label>
              <Ellipsis title={props?.sourceName || ''} />
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
