import React from 'react';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { StatusColorEnum } from '@/components/BadgeStatus';

export interface AliyunCardProps extends AliCloudType {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

const defaultImage = require('/public/images/northbound/aliyun.png');

export default (props: AliyunCardProps) => {
  return (
    <TableCard
      detail={props.detail}
      actions={props.actions}
      status={props?.state?.value}
      statusText={props?.state?.text}
      statusNames={{
        enabled: StatusColorEnum.processing,
        disabled: StatusColorEnum.error,
      }}
      showMask={false}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props?.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>网桥产品</label>
              <div className={'ellipsis'}>{props?.bridgeProductName || '--'}</div>
            </div>
            <div>
              <label>说明</label>
              <div className={'ellipsis'}>{props?.description || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
