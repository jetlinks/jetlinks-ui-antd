import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { CheckOutlined } from '@ant-design/icons';

const defaultImage = require('/public/images/scene.png');

// @ts-ignore
export interface SceneCardProps extends SceneItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
  className?: string;
  onUnBind?: (e: any) => void;
  showBindBtn?: boolean;
  cardType?: 'bind' | 'unbind';
  showTool?: boolean;
  onClick?: () => void;
}

enum TriggerWayType {
  manual = '手动触发',
  timer = '定时触发',
  device = '设备触发',
}

export const ExtraSceneCard = (props: SceneCardProps) => {
  return (
    <TableCard
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        started: StatusColorEnum.success,
        disable: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
      }}
      showTool={props.showTool}
      showMask={false}
      actions={props.actions}
      onClick={props.onClick}
      className={props.className}
    >
      <div className={'pro-table-card-item context-access'}>
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
          </div>
        </div>
      </div>
      <div className={'checked-icon'}>
        <div>
          <CheckOutlined />
        </div>
      </div>
    </TableCard>
  );
};

export default (props: SceneCardProps) => {
  return (
    <TableCard
      showMask={false}
      detail={props.detail}
      showTool={props.showTool}
      actions={props.actions}
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
          </div>
        </div>
      </div>
    </TableCard>
  );
};
