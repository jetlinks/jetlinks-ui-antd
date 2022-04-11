import React from 'react';
import type { ProductItem } from '@/pages/device/Product/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { useIntl } from 'umi';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';

export interface ProductCardProps extends ProductItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}
const defaultImage = require('/public/images/device-product.png');

export default (props: ProductCardProps) => {
  const intl = useIntl();
  return (
    <TableCard
      detail={props.detail}
      actions={props.actions}
      status={props.state}
      statusText={intl.formatMessage({
        id: `pages.system.tenant.assetInformation.${props.state ? 'published' : 'unpublished'}`,
        defaultMessage: '已发布',
      })}
      statusNames={{
        0: StatusColorEnum.error,
        1: StatusColorEnum.processing,
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
            <div>
              <label>设备类型</label>
              <div className={'ellipsis'}>{props.deviceType ? props.deviceType.text : '--'}</div>
            </div>
            <div>
              <label>接入方式</label>
              <div className={'ellipsis'}>{props.transportProtocol || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
