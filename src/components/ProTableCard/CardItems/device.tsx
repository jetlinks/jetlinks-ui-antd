import React, { useEffect, useRef, useState } from 'react';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard, Ellipsis } from '@/components';
import '@/style/common.less';
import '../index.less';
import { CheckOutlined } from '@ant-design/icons';
import { Store } from 'jetlinks-store';
import { Checkbox } from 'antd';

export interface DeviceCardProps extends Partial<DeviceInstance> {
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

const defaultImage = require('/public/images/device-type-3-big.png');

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

export const ExtraDeviceCard = (props: DeviceCardProps) => {
  const [imgUrl, setImgUrl] = useState<string>(props.photoUrl || defaultImage);
  const [assetKeys, setAssetKeys] = useState<string[]>(['read']);
  const [disabled, setDisabled] = useState(true);
  const disabledRef = useRef<boolean>(true);

  const assetsOptions =
    props.assetsOptions && props.permissionInfoList
      ? props.assetsOptions.filter((item: any) =>
          props.permissionInfoList!.some((pItem) => pItem.id === item.value),
        )
      : [];

  useEffect(() => {
    Store.subscribe('assets-device', (data: any) => {
      if (data.delete && data.id === 'rest') {
        setAssetKeys(['read']);
      }
      if (data.isAll && data.bindKeys.includes(props.id)) {
        setAssetKeys(data.assets);
        setDisabled(true);
        disabledRef.current = true;
      } else if (!data.isAll && data.bindKeys?.includes(props.id)) {
        setDisabled(false);
        disabledRef.current = false;
      } else if (!data.isAll && data.delete && props.id === data.id) {
        setAssetKeys(['read']);
      } else {
        setDisabled(true);
        disabledRef.current = true;
      }
    });
  }, []);

  return (
    <TableCard
      showTool={props.showTool}
      showMask={false}
      status={props.state?.value}
      actions={props.actions}
      statusText={props.state?.text}
      statusNames={{
        online: StatusColorEnum.processing,
        offline: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
      }}
      onClick={props.onClick}
      className={props.className}
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
          <div className={'card-item-content-flex'}>
            <div className={'flex-auto'}>
              <label>ID</label>
              <Ellipsis title={props.id || ''} />
              {/*<div className={'ellipsis'}>*/}
              {/*  <Tooltip title={props.id}>{props.id || ''}</Tooltip>*/}
              {/*</div>*/}
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
                {/*<div className={'ellipsis'}>*/}
                {/*  <Tooltip title={handlePermissionsMap(props.grantedPermissions)}>*/}
                {/*    {handlePermissionsMap(props.grantedPermissions)}*/}
                {/*  </Tooltip>*/}
                {/*</div>*/}
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

export default (props: DeviceCardProps) => {
  return (
    <TableCard
      detail={props.detail}
      actions={props.actions}
      status={props.state?.value}
      statusText={props.state?.text}
      statusNames={{
        online: StatusColorEnum.success,
        offline: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
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
              <Ellipsis title={props.deviceType ? props.deviceType.text : ''} />
              {/*<div className={'ellipsis'}>{props.deviceType ? props.deviceType.text : ''}</div>*/}
            </div>
            <div>
              <label>产品名称</label>
              <Ellipsis title={props.productName} />
              {/*<div className={'ellipsis'}>{props.productName || ''}</div>*/}
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};

export const SceneDeviceCard = (props: DeviceCardProps) => {
  const [imgUrl, setImgUrl] = useState<string>(props.photoUrl || defaultImage);

  return (
    <TableCard
      showTool={props.showTool}
      showMask={false}
      status={props.state?.value}
      actions={props.actions}
      statusText={props.state?.text}
      statusNames={{
        online: StatusColorEnum.processing,
        offline: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
      }}
      onClick={props.onClick}
      className={props.className}
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
          <div className={'card-item-content-flex'}>
            <div className={'flex-auto'}>
              <label>设备类型</label>
              <Ellipsis title={props.deviceType ? props.deviceType.text : ''} />
            </div>
            <div className={'flex-auto'}>
              <label>产品名称</label>
              <Ellipsis title={props.productName} />
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
