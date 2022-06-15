import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { Tooltip } from 'antd';

export interface DeviceCardProps extends SceneItem {
  tools: React.ReactNode[];
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
      showMask={false}
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
            <span className={'card-item-header-name ellipsis'}>
              <Tooltip title={props.name}>{props.name}</Tooltip>
            </span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>触发方式</label>
              <div className={'ellipsis'}>{TriggerWayType[props.triggerType]}</div>
            </div>
            <div>
              <label>说明</label>
              <div className={'ellipsis'}>{props.description || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
