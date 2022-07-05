import React, { useState } from 'react';
import type { ProductItem } from '@/pages/device/Product/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { useIntl } from 'umi';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { Popconfirm, Tooltip } from 'antd';
import { CheckOutlined, DisconnectOutlined } from '@ant-design/icons';

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
}

const defaultImage = require('/public/images/device-product.png');

export const PermissionsMap = {
  read: '查看',
  save: '编辑',
  delete: '删除',
};

export const handlePermissionsMap = (permissions?: string[]) => {
  return permissions && permissions.length
    ? permissions.map((item) => PermissionsMap[item]).toString()
    : '';
};

export const ExtraProductCard = (props: ProductCardProps) => {
  const intl = useIntl();
  const [imgUrl, setImgUrl] = useState<string>(props.photoUrl || defaultImage);

  return (
    <TableCard
      showTool={false}
      showMask={false}
      status={props.state}
      statusText={intl.formatMessage({
        id: `pages.system.tenant.assetInformation.${props.state ? 'published' : 'unpublished'}`,
        defaultMessage: '已发布',
      })}
      statusNames={{
        0: StatusColorEnum.error,
        1: StatusColorEnum.processing,
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
            <div className={'card-item-header-name'}>
              <Tooltip title={props.name}>
                <div className={'ellipsis'}>{props.name}</div>
              </Tooltip>
            </div>
          </div>
          <div className={'card-item-content-items'} style={{ display: 'flex', gap: 12 }}>
            {props.content}
          </div>
          <div className={'card-item-content-flex'}>
            <div className={'flex-auto'}>
              <label>ID</label>
              <div className={'ellipsis'}>
                <Tooltip title={props.id}>{props.id || ''}</Tooltip>
              </div>
            </div>
            {props.cardType === 'bind' ? (
              <div className={'flex-auto'}>
                <label>说明</label>
                <Tooltip title={props.describe}>
                  <div className={'ellipsis'}>{props.describe}</div>
                </Tooltip>
              </div>
            ) : (
              <div className={'flex-auto'}>
                <label>资产权限</label>
                <div className={'ellipsis'}>
                  <Tooltip title={handlePermissionsMap(props.grantedPermissions)}>
                    {handlePermissionsMap(props.grantedPermissions)}
                  </Tooltip>
                </div>
              </div>
            )}
            {props.showBindBtn !== false && (
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.system.role.option.unBindUser',
                  defaultMessage: '是否解除绑定',
                })}
                key="unBind"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  if (props.onUnBind) {
                    props.onUnBind(e);
                  }
                }}
              >
                <div className={'flex-button'}>
                  <DisconnectOutlined />
                </div>
              </Popconfirm>
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
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>设备类型</label>
              <div className={'ellipsis'}>{props?.deviceType?.text}</div>
            </div>
            <div>
              <label>接入方式</label>
              <div className={'ellipsis'}>{props.protocolName || '未接入'}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
