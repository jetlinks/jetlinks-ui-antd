import React from 'react';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Store } from 'jetlinks-store';

export interface AlarmConfigProps extends ConfigurationItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

export const aliyunSms = require('/public/images/alarm/alarm-config.png');

export default (props: AlarmConfigProps) => {
  return (
    <TableCard
      actions={props.actions}
      detail={props.detail}
      status={props.state?.value}
      statusText={props.state?.text}
      statusNames={{
        enabled: StatusColorEnum.success,
        disabled: StatusColorEnum.error,
      }}
      showMask={false}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={aliyunSms} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            {/*<span className={'card-item-header-name ellipsis'}>*/}
            {/*  <Tooltip title={props?.name}>{props?.name}</Tooltip>*/}
            {/*</span>*/}
            <Ellipsis title={props?.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>关联场景联动</label>
              <Ellipsis
                title={(props?.scene || []).map((item: any) => item.name).join(',') || ''}
              />
            </div>
            <div>
              <label>告警级别</label>
              <Ellipsis
                title={
                  (Store.get('default-level') || []).find(
                    (item: any) => item?.level === props?.level,
                  )?.title || props?.level
                }
              />
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
