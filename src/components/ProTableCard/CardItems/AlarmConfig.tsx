import React from 'react';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Tooltip } from 'antd';
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
            <span className={'card-item-header-name ellipsis'}>{props?.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>关联场景联动</label>
              <div className={'ellipsis'}>
                <Tooltip title={props?.sceneName || ''}>{props?.sceneName || ''}</Tooltip>
              </div>
            </div>
            <div>
              <label>告警级别</label>
              <div className={'ellipsis'}>
                <Tooltip
                  title={
                    (Store.get('default-level') || []).find(
                      (item: any) => item?.level === props?.level,
                    )?.title || props?.level
                  }
                >
                  {(Store.get('default-level') || []).find(
                    (item: any) => item?.level === props?.level,
                  )?.title || props?.level}
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
