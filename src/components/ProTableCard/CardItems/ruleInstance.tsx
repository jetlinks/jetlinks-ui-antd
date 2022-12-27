import React from 'react';
import { Ellipsis, TableCard } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import '@/style/common.less';
import type { InstanceItem } from '@/pages/rule-engine/Instance/typings';

export interface RuleInstanceCardProps extends InstanceItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

const defaultImage = require('/public/images/scene/trigger-type/scene.png');

export default (props: RuleInstanceCardProps) => {
  return (
    <TableCard
      detail={props.detail}
      actions={props.actions}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        started: StatusColorEnum.success,
        disable: StatusColorEnum.error,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
            {/*<span className={'card-item-header-name ellipsis'}>{props.name}</span>*/}
          </div>
          <div className={'card-item-content'}>{props.description}</div>
        </div>
      </div>
    </TableCard>
  );
};
