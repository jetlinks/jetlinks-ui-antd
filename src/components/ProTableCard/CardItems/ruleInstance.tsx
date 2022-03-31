import { Avatar, Card } from 'antd';
import React from 'react';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import '@/style/common.less';
import type { InstanceItem } from '@/pages/rule-engine/Instance/typings';

export interface RuleInstanceCardProps extends InstanceItem {
  actions?: React.ReactNode[];
  avatarSize?: number;
}

export default (props: RuleInstanceCardProps) => {
  return (
    <Card style={{ width: '100%' }} cover={null} actions={props.actions}>
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <Avatar
            size={props.avatarSize || 64}
            src={
              'https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/OKR.png'
            }
          />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
            <BadgeStatus
              status={props.state.value}
              text={props.state.text}
              statusNames={{
                started: StatusColorEnum.success,
                stopped: StatusColorEnum.error,
                disable: StatusColorEnum.processing,
              }}
            />
          </div>
          {props.description}
        </div>
      </div>
    </Card>
  );
};
