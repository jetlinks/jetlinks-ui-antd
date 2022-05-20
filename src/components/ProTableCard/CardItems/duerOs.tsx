import React from 'react';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { Tooltip } from 'antd';
import { DuerOSItem } from '@/pages/cloud/DuerOS/typings';

export interface DuerOSProps extends DuerOSItem {
  detail?: React.ReactNode;
  action?: React.ReactNode[];
  avatarSize?: number;
}

export const duerOS = require('/public/images/cloud/dueros.png');

export default (props: DuerOSProps) => {
  return (
    <TableCard
      actions={props.action}
      // detail={props.detail}
      showStatus={false}
      // status={props.state?.value}
      // statusText={props.state?.text}
      // statusNames={{
      //   enabled: StatusColorEnum.success,
      //   disabled: StatusColorEnum.error,
      // }}
      showMask={false}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={duerOS} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props?.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>产品</label>
              <div className={'ellipsis'}>
                <Tooltip title={props?.productName || ''}>{props?.productName || ''}</Tooltip>
              </div>
            </div>
            <div>
              <label>设备类型</label>
              <div className={'ellipsis'}>
                <Tooltip title={props.applianceType?.text}>{props.applianceType?.text}</Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
