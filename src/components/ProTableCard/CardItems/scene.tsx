import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';

export interface DeviceCardProps extends SceneItem {
  tools: React.ReactNode[];
  detail?: React.ReactNode;
}

const defaultImage = require('/public/images/scene.png');

enum TriggerWayType {
  manual = '手动触发',
  timer = '定时触发',
  device = '设备触发',
}

export default (props: DeviceCardProps) => {
  return (
    <TableCard
      // showMask={false}
      detail={props.detail}
      actions={props.tools}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        started: StatusColorEnum.success,
        disable: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div>
            <div>
              <label>触发方式</label>
              <Ellipsis title={TriggerWayType[props.triggerType]} />
            </div>
            {/*<div>*/}
            {/*  <label>说明</label>*/}
            {/*  <Ellipsis title={props.description} />*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </TableCard>
  );
};
