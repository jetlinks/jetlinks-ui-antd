import React, { useState } from 'react';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { DisconnectOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';

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
}

const defaultImage = require('/public/images/device-type-3-big.png');

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

export const ExtraDeviceCard = (props: DeviceCardProps) => {
  const intl = useIntl();
  const [imgUrl, setImgUrl] = useState<string>(props.photoUrl || defaultImage);

  return (
    <TableCard
      showTool={false}
      showMask={false}
      status={props.state?.value}
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
            <span className={'card-item-header-name'}>
              <Tooltip title={props.name}>
                <span className={'ellipsis'}>{props.name}</span>
              </Tooltip>
            </span>
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
        online: StatusColorEnum.processing,
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
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>设备类型</label>
              <div className={'ellipsis'}>{props.deviceType ? props.deviceType.text : ''}</div>
            </div>
            <div>
              <label>产品名称</label>
              <div className={'ellipsis'}>{props.productName || ''}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
