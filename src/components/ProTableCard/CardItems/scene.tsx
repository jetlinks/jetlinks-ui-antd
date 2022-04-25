import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';

export interface DeviceCardProps extends SceneItem {
  tools: React.ReactNode[];
}

const defaultImage = require('/public/images/scene.png');

export default (props: DeviceCardProps) => {
  return (
    <TableCard
      showMask={false}
      actions={props.tools}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        online: StatusColorEnum.processing,
        offline: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
      }}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>触发方式</label>
              <div className={'ellipsis'}>{'test'}</div>
            </div>
            <div>
              <label>说明</label>
              <div className={'ellipsis'}>{props.describe || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
