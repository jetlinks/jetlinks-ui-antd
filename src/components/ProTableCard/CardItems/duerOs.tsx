import React from 'react';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { DuerOSItem } from '@/pages/cloud/DuerOS/typings';
import { StatusColorEnum } from '@/components/BadgeStatus';

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
      detail={props.detail}
      // showStatus={false}
      status={props?.state?.value}
      statusText={props?.state?.text}
      statusNames={{
        enabled: StatusColorEnum.success,
        disabled: StatusColorEnum.error,
      }}
      showMask={false}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={duerOS} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <Ellipsis title={props?.name} titleClassName={'card-item-header-name'} />
            {/*<span className={'card-item-header-name ellipsis'}>*/}
            {/*  <Tooltip title={props?.name} placement="topLeft">*/}
            {/*    {props?.name}*/}
            {/*  </Tooltip>*/}
            {/*</span>*/}
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>产品</label>
              <Ellipsis title={props?.productName || ''} />
              {/*<div className={'ellipsis'}>*/}
              {/*  <Tooltip title={props?.productName || ''}>{props?.productName || ''}</Tooltip>*/}
              {/*</div>*/}
            </div>
            <div>
              <label>设备类型</label>
              <Ellipsis title={props.applianceType?.text} />
              {/*<div className={'ellipsis'}>*/}
              {/*  <Tooltip title={props.applianceType?.text}>{props.applianceType?.text}</Tooltip>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
