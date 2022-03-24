import { Avatar, Card } from 'antd';
import React from 'react';
import type { ProductItem } from '@/pages/device/Product/typings';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import '@/style/common.less';
import { useIntl } from '@@/plugin-locale/localeExports';

export interface ProductCardProps extends ProductItem {
  actions?: React.ReactNode[];
  avatarSize?: number;
}

export default (props: ProductCardProps) => {
  const intl = useIntl();

  return (
    <Card style={{ width: 340 }} cover={null} actions={props.actions}>
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <Avatar size={props.avatarSize || 64} src={props.photoUrl} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
            <BadgeStatus
              status={props.state}
              text={intl.formatMessage({
                id: `pages.system.tenant.assetInformation.${
                  props.state ? 'published' : 'unpublished'
                }`,
                defaultMessage: '已发布',
              })}
              statusNames={{
                0: StatusColorEnum.error,
                1: StatusColorEnum.processing,
              }}
            />
          </div>
          <div className={'card-item-content'}>
            <label>设备类型：</label>
            <span className={'ellipsis'}>{props.deviceType ? props.deviceType.text : '--'}</span>
          </div>
          <div className={'card-item-content'}>
            <label>接入方式：</label>
            <span className={'ellipsis'}>{props.transportProtocol || '--'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
