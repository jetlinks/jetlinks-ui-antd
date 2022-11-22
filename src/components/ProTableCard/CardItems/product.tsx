import React, { useState } from 'react';
import type { ProductItem } from '@/pages/device/Product/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { useIntl } from 'umi';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { CheckOutlined } from '@ant-design/icons';

export interface ProductCardProps extends Partial<ProductItem> {
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

const defaultImage = require('/public/images/device-product.png');

export const PermissionsMap = {
  read: '查看',
  save: '编辑',
  delete: '删除',
};

export const handlePermissionsMap = (permissions?: string[]) => {
  return permissions && permissions.length
    ? permissions
        .filter((item) => item in PermissionsMap)
        .map((item) => PermissionsMap[item])
        .toString()
    : '';
};

export const ExtraProductCard = (props: ProductCardProps) => {
  const intl = useIntl();
  const [imgUrl, setImgUrl] = useState<string>(props.photoUrl || defaultImage);

  return (
    <TableCard
      showMask={false}
      status={props.state}
      showTool={props.showTool}
      actions={props.actions}
      statusText={intl.formatMessage({
        id: `pages.device.product.status.${props.state ? 'enabled' : 'disabled'}`,
        defaultMessage: '正常',
      })}
      statusNames={{
        0: StatusColorEnum.error,
        1: StatusColorEnum.success,
      }}
      className={props.className}
      onClick={props.onClick}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img
            width={88}
            height={88}
            src={imgUrl}
            alt={''}
            onError={() => {
              setImgUrl(defaultImage);
            }}
          />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content-items'} style={{ display: 'flex', gap: 12 }}>
            {props.content}
          </div>
          <div className={'card-item-content-flex'}>
            <div className={'flex-auto'}>
              <label>ID</label>
              <Ellipsis title={props.id || ''} />
            </div>
            {props.cardType === 'bind' ? (
              <div className={'flex-auto'}>
                <label>说明</label>
                <Ellipsis title={props.describe} />
              </div>
            ) : (
              <div className={'flex-auto'}>
                <label>资产权限</label>
                <Ellipsis title={handlePermissionsMap(props.grantedPermissions)} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={'checked-icon'}>
        <div>
          <CheckOutlined />
        </div>
      </div>
    </TableCard>
  );
};

export const SceneProductCard = (props: ProductCardProps) => {
  const intl = useIntl();
  const [imgUrl, setImgUrl] = useState<string>(props.photoUrl || defaultImage);

  return (
    <TableCard
      showMask={false}
      status={props.state}
      showTool={props.showTool}
      actions={props.actions}
      statusText={intl.formatMessage({
        id: `pages.device.product.status.${props.state ? 'enabled' : 'disabled'}`,
        defaultMessage: '正常',
      })}
      statusNames={{
        0: StatusColorEnum.error,
        1: StatusColorEnum.success,
      }}
      className={props.className}
      onClick={props.onClick}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img
            width={88}
            height={88}
            src={imgUrl}
            alt={''}
            onError={() => {
              setImgUrl(defaultImage);
            }}
          />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content-items'} style={{ display: 'flex', gap: 12 }}>
            {props.content}
          </div>
          <div className={'card-item-content-flex'}>
            <div className={'flex-auto'}>
              <label>设备类型</label>
              <Ellipsis title={props?.deviceType?.text} />
            </div>
            <div className={'flex-auto'}>
              <label>接入方式</label>
              <Ellipsis title={props.accessName || '未接入'} />
            </div>
          </div>
        </div>
      </div>
      <div className={'checked-icon'}>
        <div>
          <CheckOutlined />
        </div>
      </div>
    </TableCard>
  );
};

export default (props: ProductCardProps) => {
  const intl = useIntl();
  return (
    <TableCard
      detail={props.detail}
      actions={props.actions}
      status={props.state}
      statusText={intl.formatMessage({
        id: `pages.device.product.status.${props.state ? 'enabled' : 'disabled'}`,
        defaultMessage: '正常',
      })}
      statusNames={{
        0: StatusColorEnum.error,
        1: StatusColorEnum.success,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={props.photoUrl || defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>设备类型</label>
              <Ellipsis title={props?.deviceType?.text} />
            </div>
            <div>
              <label>接入方式</label>
              <Ellipsis title={props.accessName || '未接入'} />
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
