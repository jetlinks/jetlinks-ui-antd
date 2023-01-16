import React, { useEffect, useRef, useState } from 'react';
import type { ProductItem } from '@/pages/device/Product/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { useIntl } from 'umi';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { CheckOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { Store } from 'jetlinks-store';

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
  assetsOptions?: any[];
  permissionInfoList?: any[];
  allAssets?: string[];
  onAssetsChange?: (value?: any) => void;
  isChecked?: boolean;
}

const defaultImage = require('/public/images/device-product.png');

export const PermissionsMap = {
  read: '查看',
  save: '编辑',
  delete: '删除',
  share: '共享',
};

export const handlePermissionsMap = (permissions?: string[]) => {
  return permissions && permissions.length
    ? permissions.map((item) => PermissionsMap[item]).toString()
    : '';
};

export const ExtraSceneProductCard = (props: ProductCardProps) => {
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
      <div className={'checked-icon'}>
        <div>
          <CheckOutlined />
        </div>
      </div>
    </TableCard>
  );
};

export const ExtraProductCard = (props: ProductCardProps) => {
  const intl = useIntl();
  const [imgUrl, setImgUrl] = useState<string>(props.photoUrl || defaultImage);
  const [assetKeys, setAssetKeys] = useState<string[]>(['read']);
  const [disabled, setDisabled] = useState(true);
  const disabledRef = useRef<boolean>(true);
  // console.log(props.assetsOptions, props.permissionInfoList);
  const assetsOptions =
    props.assetsOptions && props.permissionInfoList
      ? props.assetsOptions.filter((item: any) =>
          props.permissionInfoList!.some((pItem) => pItem.id === item.value),
        )
      : [];

  useEffect(() => {
    Store.subscribe('assets-product', (data: any) => {
      if (data.isAll && data.bindKeys.includes(props.id)) {
        setAssetKeys(data.assets);
        setDisabled(true);
        disabledRef.current = true;
      } else if (!data.isAll && data.bindKeys?.includes(props.id)) {
        setDisabled(false);
        disabledRef.current = false;
      } else if (!data.isAll && data.delete && props.id === data.id) {
        console.log(data);
        setAssetKeys(['read']);
      } else {
        setDisabled(true);
        disabledRef.current = true;
      }
    });
  }, []);

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
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
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
              <div className={'flex-auto stopPropagation'}>
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox.Group
                    options={assetsOptions?.map((item) => {
                      return {
                        ...item,
                        disabled: item.disabled !== true ? disabled : item.disabled,
                      };
                    })}
                    value={assetKeys}
                    onChange={(e) => {
                      console.log('assetKeys', assetKeys, e);
                      if (!disabledRef.current) {
                        setAssetKeys(e as string[]);
                        props.onAssetsChange?.(e);
                      }
                    }}
                  />
                </div>
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
      // showMask={false}
      showTool={props.showTool}
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
