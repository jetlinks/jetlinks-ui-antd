import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard, Ellipsis } from '@/components';
import '@/style/common.less';
import './index.less';

export interface ChannelCardProps extends Partial<ChannelItem> {
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

const modbusImage = require('/public/images/DataCollect/channel-modbus.png');
const opcuaImage = require('/public/images/DataCollect/channel-opcua.png');

export default (props: ChannelCardProps) => {
  return (
    <TableCard
      actions={props.actions}
      status={props.state?.value}
      statusText={props.state?.text}
      showMask={false}
      statusNames={{
        enabled: StatusColorEnum.success,
        disabled: StatusColorEnum.error,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img
            width={88}
            height={88}
            src={props.provider === 'MODBUS_TCP' ? modbusImage : opcuaImage}
            alt={''}
          />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>协议</label>
              <Ellipsis title={props.provider} />
            </div>
            <div>
              <label>地址</label>
              <Ellipsis
                title={
                  props.provider === 'MODBUS_TCP'
                    ? props?.configuration?.host
                    : props?.configuration?.endpoint
                }
              />
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
