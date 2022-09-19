import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';

export interface DeviceCardProps extends ApplyItem {
  actions: React.ReactNode[];
  detail?: React.ReactNode;
}

const defaultImage = require('/public/images/apply.png');

const providerType = new Map();
providerType.set('internal-standalone', '内部独立应用');
providerType.set('wechat-webapp', '微信网站应用');
providerType.set('internal-integrated', '内部集成应用');
providerType.set('dingtalk-ent-app', '钉钉企业内部应用');
providerType.set('third-party', '第三方应用');

export default (props: DeviceCardProps) => {
  return (
    <TableCard
      // showMask={false}
      detail={props.detail}
      actions={props.actions}
      status={props.state?.value}
      statusText={props.state?.value === 'disabled' ? '禁用' : '正常'}
      statusNames={{
        enabled: StatusColorEnum.success,
        disabled: StatusColorEnum.error,
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
          <div className={'card-item-content'}>
            <div>
              <label>类型</label>
              <Ellipsis title={providerType.get(props.provider)} />
            </div>
            <div>
              <label>说明</label>
              <Ellipsis title={props.description} />
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
